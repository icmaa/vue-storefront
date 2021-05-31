import { mapGetters } from 'vuex'
import AddressMixin from 'theme/mixins/user/addressMixin'
import PoststationMixin from 'theme/mixins/user/poststationMixin'

export default {
  name: 'Address',
  mixins: [ AddressMixin, PoststationMixin ],
  props: {
    value: {
      required: true
    },
    type: {
      type: String,
      default: 'shipping'
    },
    label: {
      type: [String, Boolean],
      default: false
    }
  },
  data () {
    return {
      selectedAddress: false,
      address: {
        company: '',
        firstname: '',
        lastname: '',
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
      this.resetForm()

      if (v === 0) v = this.address
      this.$emit('input', v)
    }
  },
  computed: {
    ...mapGetters({
      personalDetails: 'checkout/getPersonalDetails',
      addresses: 'user/getAddresses'
    }),
    isNewAddress () {
      return !this.selectedAddress || this.selectedAddress === 0
    },
    hasAddresses () {
      return this.addresses.length > 0
    }
  },
  methods: {
    submit () {
      this.$v.$touch()
      return this.$v
    },
    resetForm () {
      this.$nextTick(() => {
        this.$v.$reset()
      })
    }
  },
  beforeMount () {
    if (typeof this.value === 'number') {
      this.selectedAddress = this.value
    } else if (this.value) {
      this.selectedAddress = this.value ? this.value.id || 0 : 0
      this.address = Object.assign({}, { street: [''] }, this.value)
    }

    if (!this.address.firstname || this.address.firstname === '') {
      this.address.firstname = this.personalDetails.firstname || ''
    }
    if (!this.address.lastname || this.address.lastname === '') {
      this.address.lastname = this.personalDetails.lastname || ''
    }
  },
  unmounted () {
    this.resetForm()
  }
}
