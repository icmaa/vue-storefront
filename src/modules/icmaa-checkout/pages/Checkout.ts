import i18n from '@vue-storefront/i18n'
import config from 'config'
import VueOfflineMixin from 'vue-offline/mixin'
import { mapGetters } from 'vuex'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { Logger } from '@vue-storefront/core/lib/logger'

export default {
  mixins: [ VueOfflineMixin ],
  data () {
    return {
      stockCheckCompleted: false,
      stockCheckOK: false,
      confirmation: null,
      order: {},
      personalDetails: {},
      shipping: {},
      shippingMethod: {},
      payment: {},
      orderReview: {},
      cartSummary: {}
    }
  },
  computed: {
    ...mapGetters({
      isVirtualCart: 'cart/isVirtualCart',
      sections: 'checkout/getSections',
      isThankYouPage: 'checkout/isThankYouPage'
    })
  },
  async beforeMount () {
    this.registerSections()

    await this.$store.dispatch('checkout/load')
    this.$bus.$emit('checkout-after-load')
    this.$store.dispatch('checkout/setModifiedAt', Date.now())

    this.$bus.$on('checkout-after-paymentDetails', this.onAfterPaymentDetails)
    this.$bus.$on('checkout-before-shippingMethods', this.onBeforeShippingMethods)
    this.$bus.$on('checkout-after-shippingMethodChanged', this.onAfterShippingMethodChanged)

    this.$bus.$on('checkout-after-cartSummary', this.onAfterCartSummary)
    this.$bus.$on('checkout-before-placeOrder', this.onBeforePlaceOrder)
    this.$bus.$on('checkout-do-placeOrder', this.onDoPlaceOrder)
    this.$bus.$on('order-after-placed', this.onAfterPlaceOrder)

    if (!this.isThankYouPage) {
      this.$store.dispatch('cart/load', { forceClientState: true }).then(() => {
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
    }
  },
  beforeDestroy () {
    this.$store.dispatch('checkout/setSections')
    this.$store.dispatch('checkout/setModifiedAt', 0)
    this.$bus.$off('checkout-after-paymentDetails', this.onAfterPaymentDetails)
    this.$bus.$off('checkout-after-cartSummary', this.onAfterCartSummary)
    this.$bus.$off('checkout-before-placeOrder', this.onBeforePlaceOrder)
    this.$bus.$off('checkout-do-placeOrder', this.onDoPlaceOrder)
    this.$bus.$off('order-after-placed', this.onAfterPlaceOrder)
    this.$bus.$off('checkout-before-shippingMethods', this.onBeforeShippingMethods)
    this.$bus.$off('checkout-after-shippingMethodChanged', this.onAfterShippingMethodChanged)
  },
  watch: {
    'OnlineOnly': 'onNetworkStatusCheck'
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
    async onAfterShippingMethodChanged (payload) {
      await this.$store.dispatch('cart/syncTotals', { forceServerSync: true, methodsData: payload })
      this.shippingMethod = payload
    },
    onBeforeShippingMethods (country) {
      this.$store.dispatch('checkout/updatePropValue', ['country', country])
      this.$store.dispatch('cart/syncTotals', { forceServerSync: true })
      this.$forceUpdate()
    },
    async onAfterPlaceOrder (payload) {
      this.confirmation = payload.confirmation
      this.$store.dispatch('checkout/setThankYouPage', true)
      this.$store.dispatch('user/getOrdersHistory', { refresh: true, useCache: true })
      Logger.debug(payload.order)()
    },
    onBeforePlaceOrder (payload) {
    },
    onAfterCartSummary (receivedData) {
      this.cartSummary = receivedData
    },
    onAfterPaymentDetails (receivedData) {
      this.payment = receivedData
      this.activateSection('review')
      this.savePaymentDetails()
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
    onNetworkStatusCheck (isOnline) {
      this.checkConnection(isOnline)
    },
    checkStocks () {
      let isValid = true
      for (let child of this.$children) {
        if (child.hasOwnProperty('$v')) {
          if (child.$v.$invalid) {
            // Check if child component is Personal Details.
            // If so, then ignore validation of account creation fields.
            if (child.$v.hasOwnProperty('personalDetails')) {
              if (child.$v.personalDetails.$invalid) {
                isValid = false
                break
              }
            } else {
              isValid = false
              break
            }
          }
        }
      }

      if (typeof navigator !== 'undefined' && navigator.onLine) {
        if (this.stockCheckCompleted) {
          if (!this.stockCheckOK) {
            isValid = false
            this.notifyNotAvailable()
          }
        } else {
          this.notifyStockCheck()
          isValid = false
        }
      }
      return isValid
    },
    checkConnection (isOnline) {
      if (!isOnline) {
        this.notifyNoConnection()
      }
    },
    activateSection (sectionToActivate) {
      let currentIndex = false
      for (let section in this.activeSection) {
        this.activeSection[section] = false
        if (section === sectionToActivate) currentIndex = true
        if (currentIndex) this.doneSection[section] = false
      }

      this.activeSection[sectionToActivate] = true
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
    },
    savePaymentDetails () {
      this.$store.dispatch('checkout/savePaymentDetails', this.payment)
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
