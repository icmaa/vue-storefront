import config from 'config'
import { mapGetters } from 'vuex'
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
import { date, latin } from 'icmaa-config/helpers/validators'
import { isValid, toDate } from 'icmaa-config/helpers/datetime'

import merge from 'lodash-es/merge'
import invert from 'lodash-es/invert'

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
      this.details = this.initPersonalDetails(this.personalDetails)

      if (this.details.email && this.details.email !== '') {
        this.submit()
      } else {
        if (this.isLoggedIn) {
          this.onLoggedIn()
        }
      }
    },
    onLoggedIn () {
      this.details = this.initPersonalDetails({
        firstname: this.currentUser.firstname,
        lastname: this.currentUser.lastname,
        email: this.currentUser.email,
        gender: this.currentUser.gender,
        dob: this.currentUser.dob
      })

      this.submit()
    },
    submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        const details = Object.assign({}, this.details)
        const { dob, gender } = details

        if (gender) {
          details.gender = config.icmaa.user.genderMap[gender]
        }

        if (dob && isValid(dob, this.dateFormat)) {
          details.dob = toDate(dob, 'YYYY-MM-DD', this.dateFormat)
        }

        this.$store.dispatch('checkout/savePersonalDetails', details)
        this.$store.dispatch('checkout/activateSection', 'addresses')
      }
    },
    initPersonalDetails (data) {
      if (data.gender) {
        data.gender = invert(config.icmaa.user.genderMap)[data.gender]
      }

      if (data.dob) {
        // The date is comming in 'YYYY-MM-DD HH:mm:ss' from backend initially
        // after login so we need to transform it into our short-date.
        if (isValid(data.dob, 'YYYY-MM-DD HH:mm:ss')) {
          data.dob = toDate(data.dob, this.dateFormat, 'YYYY-MM-DD HH:mm:ss')
        } else if (isValid(data.dob, 'YYYY-MM-DD')) {
          data.dob = toDate(data.dob, this.dateFormat, 'YYYY-MM-DD')
        }
      }

      return data
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
