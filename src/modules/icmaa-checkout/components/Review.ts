import { mapGetters } from 'vuex'

export default {
  name: 'OrderReview',
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
      terms: []
    }
  },
  computed: {
    ...mapGetters({
      shippingDetails: 'checkout/getShippingDetails',
      personalDetails: 'checkout/getPersonalDetails',
      agreements: 'checkout/getAgreements'
    }),
    hasAgreements () {
      return this.agreements.length > 0
    }
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (this.$v.$invalid) return

      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: 'This is work-in-progress 🤙',
        action1: { label: this.$t('OK') }
      })

      this.$bus.$emit('checkout-before-placeOrder')
    }
  }
}
