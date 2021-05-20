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
      terms: false
    }
  },
  computed: {
    ...mapGetters({
      shippingDetails: 'checkout/getShippingDetails',
      personalDetails: 'checkout/getPersonalDetails'
    })
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
