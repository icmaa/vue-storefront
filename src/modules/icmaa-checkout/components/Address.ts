import { mapState, mapGetters } from 'vuex'
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
  },
  computed: {
    houseNumberAdvice () {
      const street = this.street.join('')
      return street.length > 8 && !/(\d)+/.test(street)
    },
    hasState () {
      return ['US', 'GB'].includes(this.countryId)
    },
    hasVatId () {
      return ['IT'].includes(this.countryId)
    },
    countryId () {
      return this.country_id.length > 0 ? this.country_id : undefined
    },
    postCodeFormat () {
      return getPostcodeRegex(this.country_id)[1]
    }
  },
  mounted () {

  },
  methods: {

  }
}
