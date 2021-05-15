import { mapGetters } from 'vuex'
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
import { date } from 'icmaa-config/helpers/validators'
import merge from 'lodash-es/merge'

export default {
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
      details: {},
      rPassword: ''
    }
  },
  computed: {
    ...mapGetters({
      storeConfig: 'icmaaConfig/getCurrentStoreConfig',
      isLoggedIn: 'user/isLoggedIn',
      currentUser: 'user/getCustomer',
      personalDetails: 'checkout/getPersonalDetails',
      isVirtualCart: 'cart/isVirtualCart'
    }),
    dateFormat () {
      return this.storeConfig.i18n.dateFormat
    }
  },
  methods: {
    onCheckoutLoad () {
      this.details = this.personalDetails
    },
    onLoggedIn () {
      this.details = {
        firstName: this.currentUser.firstname,
        lastName: this.currentUser.lastname,
        emailAddress: this.currentUser.email
      }

      this.submit()
    },
    submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.$store.dispatch('checkout/activateSection', this.isVirtualCart === true ? 'payment' : 'shipping')
        this.$store.dispatch('checkout/savePersonalDetails', this.details)
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
    if (this.isLoggedIn && !this.details.emailAddress) {
      this.onLoggedIn()
    } else if (this.isLoggedIn) {
      this.submit()
    }
  },
  beforeDestroy () {
    this.$bus.$off('checkout-after-load', this.onCheckoutLoad)
    this.$bus.$off('user-after-loggedin', this.onLoggedIn)
  },
  validations () {
    let val: any = {
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
      const createVal = {
        details: {
          gender: {
            required
          },
          dob: {
            date,
            required
          },
          password: {
            minLength: minLength(8),
            required
          }
        },
        rPassword: {
          sameAsPassword: sameAs(function () { return this.details.password }),
          required
        }
      }

      val = merge(val, createVal)
    }

    return val
  }
}
