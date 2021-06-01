import i18n from '@vue-storefront/i18n'
import VueOfflineMixin from 'vue-offline/mixin'
import { mapGetters } from 'vuex'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { OrderModule } from '@vue-storefront/core/modules/order'
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
  beforeCreate () {
    registerModule(OrderModule)
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
    }
  },
  metaInfo () {
    return {
      title: i18n.t('Checkout'),
      meta: [
        { vmid: 'robots', name: 'robots', content: 'noindex, nofollow' }
      ],
      script: [
        {
          src: '//cdn.checkout.com/js/framesv2.min.js'
        }
      ]
    }
  }
}
