import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'
import NewsletterMixin from 'theme/mixins/newsletterMixin'
import { Logger } from '@vue-storefront/core/lib/logger'
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

      this.$store.dispatch('ui/loader', { active: true, message: i18n.t('Submitting order') })

      const order = await this.$store.dispatch('checkout/placeOrder')
        .finally(result => {
          this.$store.dispatch('ui/loader', false)
          return result
        })

      if (order) {
        this.subscribeNewsletter(order)
        this.$router.push(localizedRoute('checkout-success'))
      }
    },
    subscribeNewsletter (order) {
      if (this.newsletter !== true || !order.personalDetails.email) return
      return this.$store.dispatch('newsletter/subscribe', order.personalDetails.email)
        .catch(err => {
          Logger.error('Error during newsletter-subscription after order-submit:', 'checkout', err)()
        })
    }
  }
}
