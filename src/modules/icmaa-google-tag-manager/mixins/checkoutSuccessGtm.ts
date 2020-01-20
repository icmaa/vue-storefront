import Vue from 'vue'
import VueGtm from 'vue-gtm'
import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { googleTagManager } from 'config'
import AbstractMixin from './abstractMixin'

export default {
  mixins: [ AbstractMixin ],
  computed: {
    ...mapGetters({
      ordersHistory: 'user/getOrdersHistory'
    }),
    order () {
      return this.ordersHistory[0]
    },
    orderId () {
      return this.order.id
    },
    orderStoreName () {
      return this.order.store_name
    },
    orderTotalDue () {
      return this.order.total_due
    },
    orderTaxAmount () {
      return this.order.tax_amount
    },
    orderShippingDescription () {
      return this.order.shipping_description
    },
    paymentMethod () {
      return this.order.payment.additional_information[0]
    },
    couponCode () {
      return this.order.coupon_code
    },
    couponCodeRule () {
      return this.order.coupon_rule_name
    },
    singleOrderItems () {
      return this.order.products
        .map(p => this.getGTMProductDTO(p, googleTagManager.categoryAttributes))
    }
  },
  methods: {
    checkoutSuccessGtm () {
      if (!this.enabled) {
        return
      }

      const GTM: VueGtm = (Vue as any).gtm

      const storeView = currentStoreView()
      const currencyCode = storeView.i18n.currencyCode

      GTM.trackEvent({
        event: 'icmaa-checkout-success-view',
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
              coupon: this.couponCode,
              couponrule: this.couponCodeRule
            },
            products: this.singleOrderItems
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
