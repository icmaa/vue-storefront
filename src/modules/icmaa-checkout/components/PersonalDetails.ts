import { mapGetters } from 'vuex'

export default {
  name: 'PersonalDetails',
  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      isFilled: false,
      personalDetails: {},
      rPassword: ''
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/getCustomer',
      isVirtualCart: 'cart/isVirtualCart'
    })
  },
  methods: {
    onCheckoutLoad () {
      this.personalDetails = this.$store.state.checkout.personalDetails
    },
    onLoggedIn (receivedData) {
      this.personalDetails = {
        firstName: receivedData.firstname,
        lastName: receivedData.lastname,
        email: receivedData.email
      }
    },
    submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.isFilled = true
        this.$emit('input', true)

        this.$bus.$emit('checkout-after-personalDetails', this.personalDetails, this.$v)
      }
    },
    openLoginModal () {
      this.$store.dispatch('ui/showModal', 'modal-signup')
    }
  },
  beforeMount () {
    this.$bus.$on('checkout-after-load', this.onCheckoutLoad)
    this.$bus.$on('user-after-loggedin', this.onLoggedIn)
  },
  beforeDestroy () {
    this.$bus.$off('checkout-after-load', this.onCheckoutLoad)
    this.$bus.$off('user-after-loggedin', this.onLoggedIn)
  }
}
