import Vue from 'vue'
import VueGtm from 'vue-gtm'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import AbstractMixin from './abstractMixin'
import { mapGetters } from 'vuex'

export default {
  mixins: [AbstractMixin],
  computed: {
    ...mapGetters({
      ordersHistory: 'user/getOrdersHistory'
    }),
    order () {
      return this.ordersHistory[0]
    },
    orderId () {
      return this.order && this.order.id
    },
    orderStoreName () {
      return this.order && this.order.store_name
    },
    orderTotalDue () {
      return this.order && this.order.total_due
    },
    orderTaxAmount () {
      return this.order && this.order.tax_amount
    },
    orderShippingDescription () {
      return this.order && this.order.shipping_description
    },
    paymentMethod () {
      return this.order && this.order.payment.additional_information[0]
    },
    couponCode () {
      return this.order && this.order.coupon_code
    },
    couponCodeRule () {
      return this.order && this.order.coupon_rule_name
    },
    singleOrderItems () {
      return this.order && this.order.items
    }
  },
  methods: {
    checkoutSuccessGtm () {
      if (!this.enabled) {
        return
      }

      console.log('debug', this.orderId)

      const GTM: VueGtm = (Vue as any).gtm

      const storeView = currentStoreView()
      const currencyCode = storeView.i18n.currencyCode

      GTM.trackEvent({
        event: 'CheckoutSuccessView',
        ecommerce: {
          currencyCode: currencyCode,
          purchase: {
            actionField: {
              id: this.orderId,
              affiliation: this.orderStoreName,
              revenue: this.orderTotalDue,
              tax: this.orderTaxAmount,
              shipping: this.orderShippingDescription,
              payment: this.paymentMethod,
              coupon: this.couponCodeRule,
              couponrule: this.couponCodeRule
            },
            products: [this.singleOrderItems]
          }
        }
      })
    }
  },
  mounted () {
    this.$bus.$on('checkout-success-last-order-loaded', () => {
      this.checkoutSuccessGtm()
    })
  }
}
