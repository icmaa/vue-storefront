import { mapGetters } from 'vuex'
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

export default {
  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      isFilled: false,
      details: {},
      rPassword: ''
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/getCustomer',
      personalDetails: 'checkout/getPersonalDetails',
      isVirtualCart: 'cart/isVirtualCart'
    })
  },
  methods: {
    onCheckoutLoad () {
      this.details = this.personalDetails
    },
    onLoggedIn (data) {
      this.details = {
        firstName: data.firstname,
        lastName: data.lastname,
        emailAddress: data.email
      }
    },
    submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.isFilled = true
        this.$emit('input', true)

        this.$bus.$emit('checkout-after-personalDetails', this.details)
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
  mounted () {
    this.onCheckoutLoad()
  },
  beforeDestroy () {
    this.$bus.$off('checkout-after-load', this.onCheckoutLoad)
    this.$bus.$off('user-after-loggedin', this.onLoggedIn)
  },
  validations () {
    const val: any = {
      details: {
        emailAddress: {
          required,
          email
        },
        firstName: {
          required
        },
        lastName: {
          required
        }
      }
    }

    if (this.details.createAccount) {
      val.details.password = {
        minLength: minLength(8),
        required
      }
      val.rPassword = {
        sameAsPassword: sameAs(function () { return this.details.password }),
        required
      }
    }

    return val
  }
}
