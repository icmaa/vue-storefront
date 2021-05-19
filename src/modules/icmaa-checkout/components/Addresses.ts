import { mapGetters } from 'vuex'

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
    ...mapGetters({
      getAddressbyId: 'user/getAddressbyId',
      getCountryNameByCode: 'icmaaConfig/getCountryNameByCode',
      getShippingDetails: 'checkout/getShippingDetails',
      getPaymentDetails: 'checkout/getPaymentDetails'
    }),
    shippingAddressDTO () {
      return this.getAddress(this.shippingAddress)
    },
    billingAddressDTO () {
      return this.getAddress(this.billingAddress || this.shippingAddress)
    }
  },
  beforeMount () {
    if (this.getShippingDetails) {
      this.shippingAddress = this.getShippingDetails.id || this.getShippingDetails
      if (this.getShippingDetails.useForBilling !== undefined) {
        this.billingAddressIsSameAsShipping = this.getShippingDetails.useForBilling
      }
    }

    if (this.getPaymentDetails && !this.billingAddressIsSameAsShipping) {
      this.billingAddress = this.getPaymentDetails.id || this.getPaymentDetails
    }
  },
  methods: {
    submit () {
      const shipping = this.$refs.shippingAddress.submit()

      if (!this.billingAddressIsSameAsShipping) {
        const billing = this.$refs.billingAddress.submit()
        if (billing.$invalid) return false
      }

      if (shipping.$invalid) return false

      this.$store.dispatch(
        'checkout/saveShippingDetails',
        Object.assign({}, this.shippingAddressDTO, { useForBilling: this.billingAddressIsSameAsShipping })
      )

      this.$store.dispatch('checkout/savePaymentDetails', this.billingAddressDTO)

      return this.$store.dispatch('checkout/activateSection', 'shipping')
    },
    getAddress (address): string | false {
      if (!address) return false
      if (typeof address === 'number') {
        address = this.getAddressbyId(address)
      }

      const { country_id } = address
      address.country = this.getCountryNameByCode(country_id)

      return address
    }
  }
}