import { mapGetters } from 'vuex'

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
      paymentDetails: 'checkout/getPaymentDetails'
    })
  },
  beforeMount () {
    this.$bus.$on('checkout-after-load', this.onCheckoutLoad)
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'success',
          message: 'This is work-in-progress 🤙',
          action1: { label: this.$t('OK') }
        })
      }
    }
  }
}
