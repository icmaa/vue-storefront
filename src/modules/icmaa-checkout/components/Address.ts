import AddressMixin from 'theme/mixins/user/addressMixin'

export default {
  name: 'Address',
  mixins: [ AddressMixin ],
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
    }
  },
  methods: {
    submit () {
      this.$v.$touch()
      return this.$v
    }
  }
}
