import { mapGetters } from 'vuex'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { IcmaaPaymentModule } from 'icmaa-payment'

export default {
  name: 'Payment',
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
      selected: false
    }
  },
  computed: {
    ...mapGetters({
      paymentMethods: 'checkout/getPaymentMethods',
      paymentMethodByCode: 'checkout/getPaymentMethodByCode',
      paymentDetails: 'checkout/getPaymentDetails',
      infoComponentByCode: 'payment/getInfoComponentByCode'
    }),
    selectedMethod () {
      return this.paymentMethodByCode(this.selected)
    },
    infoComponent () {
      if (!this.selected) return false
      return this.infoComponentByCode(this.selected)
    }
  },
  watch: {
    'selected': function (code) {
      this.$store.dispatch('payment/initMethod', code)
    }
  },
  methods: {
    async submit () {
      this.$v.$touch()
      if (!this.$v.$invalid && this.selectedMethod) {
        this.$store.dispatch('checkout/loading')

        this.$bus.$emit('checkout-payment-method-changed', this.selectedMethod)
        this.$store.dispatch(
          'checkout/savePaymentMethod',
          this.selectedMethod
        )

        const paymentHandler = await this.$store.dispatch('payment/saveMethod', this.selected)
        if (!paymentHandler) {
          this.$store.dispatch('checkout/loading', false)
          return
        }

        const sync = await this.$store.dispatch('cart/syncTotals', { forceServerSync: true })
          .then(() => true)
          .catch(() => {
            this.$store.dispatch('checkout/loading', false)
            return false
          })

        if (!sync) return

        this.$store.dispatch('checkout/activateSection', 'review')
      }
    }
  },
  created () {
    registerModule(IcmaaPaymentModule)
  }
}
