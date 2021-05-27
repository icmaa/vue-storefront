import i18n from '@vue-storefront/i18n'
import config from 'config'
import VueOfflineMixin from 'vue-offline/mixin'
import { mapGetters } from 'vuex'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { Logger } from '@vue-storefront/core/lib/logger'

export default {
  mixins: [ VueOfflineMixin ],
  data () {
    return {
      stockCheckCompleted: false,
      stockCheckOK: false,
      order: {},
      personalDetails: {},
      shipping: {},
      shippingMethod: {},
      payment: {}
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'checkout/isLoading',
      isVirtualCart: 'cart/isVirtualCart',
      sections: 'checkout/getSections'
    })
  },
  watch: {
    isLoading (active) {
      this.$store.dispatch('ui/loader', active)
    }
  },
  created () {
    /**
     * Load this here to prevent virtual DOM tree mismatching warning:
     * `The client-side rendered virtual DOM tree is not matching server-rendered content.`
     */
    this.registerSections()
  },
  async beforeMount () {
    await this.$store.dispatch('checkout/load')
    this.$bus.$emit('checkout-after-load')
    this.$store.dispatch('checkout/setModifiedAt', Date.now())

    this.$bus.$on('checkout-do-placeOrder', this.onDoPlaceOrder)
    this.$bus.$on('order-after-placed', this.onAfterPlaceOrder)

    this.$store.dispatch('cart/load', { forceClientState: true })
      .then(() => {
        if (this.$store.state.cart.cartItems.length === 0) {
          this.notifyEmptyCart()
          this.$router.push(this.localizedRoute('/'))
        } else {
          this.stockCheckCompleted = false
          const checkPromises = []
          for (let product of this.$store.state.cart.cartItems) { // check the results of online stock check
            if (product.onlineStockCheckid) {
              checkPromises.push(new Promise((resolve, reject) => {
                StorageManager.get('syncTasks').getItem(product.onlineStockCheckid, (err, item) => {
                  if (err || !item) {
                    if (err) Logger.error(err)()
                    resolve(null)
                  } else {
                    product.stock = item.result
                    resolve(product)
                  }
                })
              }))
            }
          }
          Promise.all(checkPromises).then((checkedProducts) => {
            this.stockCheckCompleted = true
            this.stockCheckOK = true
            for (let chp of checkedProducts) {
              if (chp && chp.stock) {
                if (!chp.stock.is_in_stock) {
                  this.stockCheckOK = false
                  chp.errors.stock = i18n.t('Out of stock!')
                  this.notifyOutStock(chp)
                }
              }
            }
          })
        }
      })
  },
  beforeDestroy () {
    this.$store.dispatch('checkout/setSections')
    this.$store.dispatch('checkout/setModifiedAt', 0)

    this.$bus.$off('checkout-do-placeOrder', this.onDoPlaceOrder)
    this.$bus.$off('order-after-placed', this.onAfterPlaceOrder)
  },
  methods: {
    registerSections () {
      const sections = {}
      this.steps.forEach((step, i) => {
        sections[step.name] = {
          active: (i === 0),
          done: false
        }
      })

      this.$store.dispatch('checkout/setSections', sections)
    },
    async onAfterPlaceOrder (payload) {
      this.$store.dispatch('user/getOrdersHistory', { refresh: true, useCache: true })
      this.$router.push(this.localizedRoute('/order-success'))

      Logger.debug('Order has been placed', 'checkout', payload.order)()
    },
    onDoPlaceOrder (additionalPayload) {
      if (this.$store.state.cart.cartItems.length === 0) {
        this.notifyEmptyCart()
        this.$router.push(this.localizedRoute('/'))
      } else {
        this.payment.paymentMethodAdditional = additionalPayload
        this.placeOrder()
      }
    },
    checkStocks () {
      let isValid = true
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        if (this.stockCheckCompleted) {
          if (!this.stockCheckOK) {
            isValid = false
            this.notifyNotAvailable()
          }
        } else {
          isValid = false
          this.notifyStockCheck()
        }
      }

      return isValid
    },
    checkConnection (isOnline) {
      if (!isOnline) {
        this.notifyNoConnection()
      }
    },
    // This method checks if there exists a mapping of chosen payment method to one of Magento's payment methods.
    getPaymentMethod () {
      let paymentMethod = this.payment.paymentMethod
      if (config.orders.payment_methods_mapping.hasOwnProperty(paymentMethod)) {
        paymentMethod = config.orders.payment_methods_mapping[paymentMethod]
      }
      return paymentMethod
    },
    prepareOrder () {
      this.order = {
        user_id: this.$store.state.user.current ? this.$store.state.user.current.id.toString() : '',
        cart_id: this.$store.state.cart.cartServerToken ? this.$store.state.cart.cartServerToken.toString() : '',
        products: this.$store.state.cart.cartItems,
        addressInformation: {
          billingAddress: {
            region: this.payment.state,
            region_id: this.payment.region_id ? this.payment.region_id : 0,
            country_id: this.payment.country,
            street: [this.payment.streetAddress, this.payment.apartmentNumber],
            company: this.payment.company,
            telephone: this.payment.phoneNumber,
            postcode: this.payment.zipCode,
            city: this.payment.city,
            firstname: this.payment.firstName,
            lastname: this.payment.lastName,
            email: this.personalDetails.emailAddress,
            region_code: this.payment.region_code ? this.payment.region_code : '',
            vat_id: this.payment.taxId
          },
          shipping_method_code: this.shippingMethod.method_code ? this.shippingMethod.method_code : this.shipping.shippingMethod,
          shipping_carrier_code: this.shippingMethod.carrier_code ? this.shippingMethod.carrier_code : this.shipping.shippingCarrier,
          payment_method_code: this.getPaymentMethod(),
          payment_method_additional: this.payment.paymentMethodAdditional,
          shippingExtraFields: this.shipping.extraFields
        }
      }
      if (!this.isVirtualCart) {
        this.order.addressInformation.shippingAddress = {
          region: this.shipping.state,
          region_id: this.shipping.region_id ? this.shipping.region_id : 0,
          country_id: this.shipping.country,
          street: [this.shipping.streetAddress, this.shipping.apartmentNumber],
          company: '',
          telephone: this.shipping.phoneNumber,
          postcode: this.shipping.zipCode,
          city: this.shipping.city,
          firstname: this.shipping.firstName,
          lastname: this.shipping.lastName,
          email: this.personalDetails.emailAddress,
          region_code: this.shipping.region_code ? this.shipping.region_code : ''
        }
      }
      return this.order
    },
    placeOrder () {
      this.checkConnection({ online: typeof navigator !== 'undefined' ? navigator.onLine : true })
      if (this.checkStocks()) {
        this.$store.dispatch('checkout/placeOrder', { order: this.prepareOrder() })
      } else {
        this.notifyNotAvailable()
      }
    }
  },
  metaInfo () {
    return {
      title: i18n.t('Checkout'),
      meta: [
        { vmid: 'robots', name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  }
}
