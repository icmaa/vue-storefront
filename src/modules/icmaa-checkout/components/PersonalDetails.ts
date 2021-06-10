import config from 'config'
import { mapGetters } from 'vuex'
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
import { date, latin } from 'icmaa-config/helpers/validators'
import { toDate } from 'icmaa-config/helpers/datetime'
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
    onCheckoutAfterLoad () {
      this.details = this.personalDetails

      if (this.details.email && this.details.email !== '') {
        this.submit()
      } else {
        if (this.isLoggedIn) {
          this.onLoggedIn()
        }
      }
    },
    onLoggedIn () {
      this.details = {
        firstname: this.currentUser.firstname,
        lastname: this.currentUser.lastname,
        email: this.currentUser.email,
        gender: this.currentUser.gender,
        dob: this.currentUser.dob
      }

      this.submit()
    },
    submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        if (this.details.gender) {
          const gender = config.icmaa.user.genderMap[this.details.gender]
          this.details.gender = gender
        }

        if (this.details.dob) {
          this.details.dob = toDate(this.details.dob, 'YYYY-MM-DD', this.dateFormat)
        }

        this.$store.dispatch('checkout/savePersonalDetails', this.details)
        this.$store.dispatch('checkout/activateSection', 'addresses')
      }
    },
    openLoginModal () {
      this.$store.dispatch('ui/showModal', 'modal-signup')
    }
  },
  mounted () {
    this.$bus.$on('user-after-loggedin', this.onLoggedIn)
    this.onCheckoutAfterLoad()
  },
  destroyed () {
    this.$bus.$off('user-after-loggedin', this.onLoggedIn)
  },
  validations () {
    let val: any = {
      details: {
        email: {
          required,
          email
        },
        firstname: {
          required,
          latin
        },
        lastname: {
          required,
          latin
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
