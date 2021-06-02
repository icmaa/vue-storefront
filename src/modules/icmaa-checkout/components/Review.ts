import { mapGetters } from 'vuex'
import NewsletterMixin from 'theme/mixins/newsletterMixin'
import { localizedRoute } from '@vue-storefront/core/lib/multistore'

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
    async submit () {
      this.$v.$touch()
      if (this.$v.$invalid) return

      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: 'This is work-in-progress 🤙',
        action1: { label: this.$t('OK') }
      })

      this.$store.dispatch('ui/loader', true)

      await this.$store.dispatch('checkout/placeOrder')
        .finally(() => this.$store.dispatch('ui/loader', false))

      this.$router.push(localizedRoute('checkout-success'))
    }
  }
}
