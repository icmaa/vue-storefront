import { getPostcodeRegex } from 'icmaa-config/helpers/validators'

export default {
  name: 'Address',
  props: {
    type: {
      type: String,
      default: 'shipping'
    }
  },
  data () {
    return {
      selectedAddress: false,
      address: {
        company: '',
        firstname: '',
        lastname: '',
        region: '',
        city: '',
        street: [''],
        postcode: '',
        country_id: '',
        region_id: null,
        telephone: '',
        vat_id: null
      }
    }
  },
  watch: {
    address: {
      deep: true,
      handler (v) {
        this.$emit('input', v)
      }
    },
    selectedAddress (v) {
      if (v === 0) v = this.address
      this.$emit('input', v)
    }
  },
  computed: {
    isNewAddress () {
      return !this.selectedAddress || this.selectedAddress === 0
    },
    houseNumberAdvice () {
      const street = this.address.street.join('')
      return street.length > 8 && !/(\d)+/.test(street)
    },
    hasState () {
      return ['US', 'GB'].includes(this.countryId)
    },
    hasVatId () {
      return ['IT'].includes(this.countryId)
    },
    countryId () {
      return this.address.country_id.length > 0 ? this.address.country_id : undefined
    },
    postCodeFormat () {
      return getPostcodeRegex(this.address.country_id)[1]
    }
  },
  methods: {
    submit () {
      this.$v.$touch()
      return this.$v
    }
  }
}
