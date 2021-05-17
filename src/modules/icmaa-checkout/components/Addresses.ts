
export default {
  name: 'Addresses',
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
      shippingAddress: null,
      billingAddress: null,
      billingAddressIsSameAsShipping: true
    }
  },
  watch: {
    billingAddressIsSameAsShipping (v) {
      if (v === true) this.billingAddress = null
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    submit () {
      const shipping = this.$refs.shippingAddress.submit()

      if (!this.billingAddressIsSameAsShipping) {
        const billing = this.$refs.billingAddress.submit()
        if (!billing.invalid) return false
      }

      if (!shipping.invalid) return false

      return this.$store.dispatch('checkout/activateSection', 'shipping')
    }
  }
}
