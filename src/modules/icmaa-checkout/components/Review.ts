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
      orderButtonComponentByCode: 'payment/getOrderButtonComponentByCode',
      paymentMethod: 'checkout/getPaymentMethod',
      hasAgreements: 'checkout/hasAgreements',
      viewport: 'ui/getViewport'
    }),
    isMobile () {
      return ['xs', 'sm', 'md'].includes(this.viewport)
    },
    orderButtonComponent () {
      return this.orderButtonComponentByCode(this.paymentMethod.code)
    }
  },
  methods: {
    async submit () {
      this.$v.$touch()
      if (this.$v.$invalid) return

      this.$store.dispatch('ui/loader', { active: true, message: i18n.t('Submitting order') })

      const order = await this.$store.dispatch('checkout/placeOrder')
        .catch(e => {
          Logger.error('Couldn\'t place order:', 'icmaa-checkout', e.message)()
          this.$store.dispatch('ui/loader', false)
          return false
        })

      if (order) {
        if (order.redirectToPaymentGateway) return

        this.$store.dispatch('icmaaGoogleTagManager/setLastOrderId', order.orderId)
        await this.subscribeNewsletter(order)

        this.$router.push(localizedRoute('checkout-success'))
      } else {
        this.$store.dispatch('ui/loader', false)
      }
    },
    async subscribeNewsletter (order) {
      if (this.newsletter !== true || !order.personalDetails.email) return

      this.$store.dispatch('ui/loader', { active: true, message: i18n.t('Subscribe to newsletter') })
      return this.$store.dispatch('newsletter/subscribe', order.personalDetails.email)
        .catch(err => {
          Logger.error('Error during newsletter-subscription after order-submit:', 'icmaa-checkout', err)()
        })
    }
  },
  destroyed () {
    /** Unset loader after redirect to success-page */
    this.$store.dispatch('ui/loader', false)
  }
}
