import i18n from '@vue-storefront/i18n'
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
    placeOrder () {
      if (this.checkStocks()) {
        this.$store.dispatch('checkout/placeOrder')
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
