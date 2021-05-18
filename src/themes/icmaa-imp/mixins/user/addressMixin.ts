import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

import { getPostcodeRegex } from 'icmaa-config/helpers/validators'

import { getStates } from 'icmaa-config/helpers/i18n/states'

export default {
  data () {
    return {
      address: {}
    }
  },
  computed: {
    ...mapGetters({
      customer: 'user/getCustomer',
      countries: 'icmaaConfig/getCountries'
    }),
    countryId () {
      return this.address.country_id.length > 0 ? this.address.country_id : undefined
    },
    postCodeFormat () {
      return getPostcodeRegex(this.address.country_id)[1]
    },
    states () {
      if (this.hasState) {
        return getStates(this.countryId).map(({ code: value, name: label }) => ({ label, value }))
      }

      return []
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
    }
  },
  methods: {
    setAddressDefaults () {
      this.address = {
        entity_id: '',
        company: '',
        prefix: '',
        firstname: this.customer.firstname,
        lastname: this.customer.lastname,
        suffix: '',
        street: [''],
        postcode: '',
        city: '',
        country_id: currentStoreView().i18n.defaultCountry,
        region_id: null,
        telephone: '',
        vat_id: null,
        is_default_billing: false,
        is_default_shipping: false
      }

      return this.address
    }
  }
}
