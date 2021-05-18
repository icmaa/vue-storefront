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
      addresses: 'user/getAddresses',
      getCountryNameByCode: 'icmaaConfig/getCountryNameByCode'
    }),
    previewShippingAddress () {
      return this.getPreviewAddress(this.shippingAddress)
    },
    previewBillingAddress () {
      return this.getPreviewAddress(this.billingAddress)
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

      return this.$store.dispatch('checkout/activateSection', 'shipping')
    },
    getPreviewAddress (address): string | false {
      if (!address) return false

      if (typeof address === 'number') {
        address = this.addresses.find(a => a.id === address)
      }

      const { country_id } = address
      address.country = this.getCountryNameByCode(country_id)

      return address
    }
  }
}
