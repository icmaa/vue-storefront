import { mapGetters } from 'vuex'

export default {
  name: 'Shipping',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    done: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selected: false,
      priorityHandling: false
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'checkout/isLoading',
      getShippingMethods: 'checkout/getShippingMethods',
      shippingDetails: 'checkout/getShippingDetails',
      isPriorityHandlingEnabled: 'checkout/isPriorityHandlingEnabled'
    }),
    hasShippingMethod () {
      return this.getShippingMethods.length > 0
    },
    shippingMethods () {
      const methods = this.getShippingMethods
      return methods.map(method => {
        const { code, method_title: title, method_description: description, carrier_code: carrierCode, amount } = method

        let image
        try {
          image = require(`theme/assets/logos/shipping/checkout/${carrierCode}.png`)
        } catch (e) {
          image = false
        }

        return { code, title, description, amount, image }
      })
    },
    selectedMethod () {
      return this.shippingMethods.find(m => m.code === this.selected)
    },
    rawSelectedMethod () {
      return this.getShippingMethods.find(m => m.code === this.selected)
    }
  },
  async beforeMount () {
    if (this.shippingMethods.length > 0) {
      const firstMethod = this.shippingMethods.slice(0, 1).pop()
      this.selected = firstMethod.code

      if (this.isPriorityHandlingEnabled) {
        return
      }

      if (this.shippingMethods.length === 1) {
        this.submit()
      }
    }
  },
  methods: {
    async submit () {
      this.$v.$touch()
      if (!this.$v.$invalid && this.selectedMethod) {
        this.$store.dispatch('checkout/loading')

        let shippingMethod = this.rawSelectedMethod
        if (this.isPriorityHandlingEnabled && this.priorityHandling) {
          shippingMethod = Object.assign({}, shippingMethod, { priorityHandling: true })
        }

        this.$store.dispatch(
          'checkout/saveShippingMethod',
          shippingMethod
        )

        await this.$store.dispatch('cart/syncTotals', { forceServerSync: true })
        await this.$store.dispatch('cart/syncPaymentMethods', { forceServerSync: true })

        this.$store.dispatch('checkout/activateSection', 'payment')
      }
    }
  }
}