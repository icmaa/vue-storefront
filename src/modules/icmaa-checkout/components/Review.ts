import { mapGetters } from 'vuex'
import NewsletterMixin from 'theme/mixins/newsletterMixin'

export default {
  name: 'OrderReview',
  mixins: [ NewsletterMixin ],
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
      terms: false,
      newsletter: false
    }
  },
  computed: {
    ...mapGetters({
      shippingDetails: 'checkout/getShippingDetails',
      personalDetails: 'checkout/getPersonalDetails',
      hasAgreements: 'checkout/hasAgreements'
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
