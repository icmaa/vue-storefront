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
      selected: false
    }
  },
  computed: {
    ...mapGetters({
      getShippingMethods: 'checkout/getShippingMethods',
      shippingDetails: 'checkout/getShippingDetails'
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
    }
  },
  async beforeMount () {
    if (this.shippingMethods.length > 0) {
      const firstMethod = this.shippingMethods.slice(0, 1).pop()
      this.selected = firstMethod.code
    }
  },
  methods: {
    async submit () {
      this.$v.$touch()
      if (!this.$v.$invalid && this.selectedMethod) {
        this.$store.dispatch('checkout/loading')

        this.$store.dispatch(
          'checkout/saveShippingDetails',
          Object.assign({}, this.shippingDetails)
        )

        await this.$store.dispatch('cart/syncTotals', { forceServerSync: true })
        this.$store.dispatch('checkout/activateSection', 'payment')
      }
    }
  }
}
