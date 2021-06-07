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
      cartItems: 'cart/getCartItems',
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
     * Load this here to prevent virtual DOM tree mismatching warnings like:
     * `The client-side rendered virtual DOM tree is not matching server-rendered content.`
     */
    this.registerSections()
  },
  async beforeMount () {
    await this.$store.dispatch('checkout/load')

    this.$bus.$on('user-after-logout', this.afterUserLogout)
    this.$bus.$on('cart-after-cleared', this.afterCartCleared)

    this.$store.dispatch('cart/load', { forceClientState: true })
      .then(() => {
        if (this.cartItems.length === 0) {
          this.notifyEmptyCart()
          this.$router.push(this.localizedHomeRoute)
        } else {
          this.checkCart()
        }
      })
  },
  beforeDestroy () {
    this.$store.dispatch('checkout/setSections')
    this.$bus.$off('user-after-logout', this.afterUserLogout)
    this.$bus.$off('cart-after-cleared', this.afterCartCleared)
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
    checkCart () {
      this.stockCheckCompleted = false

      const checkPromises = []
      for (let product of this.cartItems) {
        if (product.onlineStockCheckid) {
          checkPromises.push(new Promise(resolve => {
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
    },
    afterCartCleared () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t('The checkout couldn\'t be continued because you cart has been expired. Please try again.'),
        action1: { label: this.$t('OK') }
      })

      this.$store.dispatch('checkout/loading', false)
      this.$router.push(this.localizedHomeRoute)
    },
    afterUserLogout () {
      // This prevents the "cart has been expired message" because it's emptied on logout
      this.$bus.$off('cart-after-cleared', this.afterCartCleared)

      this.$store.dispatch('checkout/loading', false)
      this.$router.push(this.localizedHomeRoute)
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
