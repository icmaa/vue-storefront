import { mapGetters } from 'vuex'
import AddressMixin from 'theme/mixins/user/addressMixin'

export default {
  name: 'Address',
  mixins: [ AddressMixin ],
  props: {
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
  unmounted () {
    this.resetForm()
  }
}
