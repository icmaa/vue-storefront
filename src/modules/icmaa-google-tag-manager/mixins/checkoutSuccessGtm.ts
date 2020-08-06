import Vue from 'vue'
import VueGtm from 'vue-gtm'
import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { googleTagManager } from 'config'
import { formatValue } from 'icmaa-config/helpers/price'
import { toDate } from 'icmaa-config/helpers/datetime'
import omit from 'lodash-es/omit'
import round from 'lodash-es/round'

export default {
  computed: {
    ...mapGetters({
      ordersHistory: 'user/getOrdersHistory',
      isGtmEnabled: 'icmaaGoogleTagManager/enabled',
      getGTMProductDTO: 'icmaaGoogleTagManager/getProductDTO',
      gtmLastOrderId: 'icmaaGoogleTagManager/getLastOrderId'
    }),
    order () {
      return this.ordersHistory.length > 0 ? this.ordersHistory[0] : false
    },
    orderId () {
      return this.order.increment_id || this.order.id ? (this.order.increment_id || this.order.id).toString() : null
    },
    orderStoreName () {
      return this.order.store_name
    },
    orderDate () {
      return toDate(this.order.created_at, 'YYYY-MM-DD HH:MM:ss')
    },
    orderGrandTotal () {
      return formatValue(this.order.grand_total, 'en-US')
    },
    orderSubTotal () {
      return formatValue(this.order.subtotal, 'en-US')
    },
    orderTaxAmount () {
      return formatValue(this.order.tax_amount, 'en-US')
    },
    orderShippingAmount () {
      return formatValue(this.order.shipping_amount, 'en-US')
    },
    orderShippingDescription () {
      return this.order.shipping_description
    },
    paymentMethod () {
      return this.order.payment.additional_information[0]
    },
    couponCode () {
      return this.order.coupon_code ? String(this.order.coupon_code) : null
    },
    couponCodeRule () {
      return this.order.coupon_rule_name
    },
    singleOrderItems () {
      return this.order.items
        .map(i => {
          const product = this.order.products.find(p => p.sku === i.sku || (p.configurable_children && p.configurable_children.some(c => c.sku === i.sku))) || {}
          const productDTO = this.getGTMProductDTO(product, googleTagManager.categoryAttributes)
          const additionalData = { sku: i.sku, quantity: round(i.qty_ordered), id: String(productDTO.id).toString() }
          return Object.assign(productDTO, additionalData)
        })
        .map(p => omit(p, ['children']))
    }
  },
  methods: {
    checkoutSuccessGtm () {
      if (!this.isGtmEnabled || !this.order || this.gtmLastOrderId === this.orderId) {
        return
      }

      const GTM: VueGtm = (Vue as any).gtm

      const storeView = currentStoreView()
      const currencyCode = storeView.i18n.currencyCode

      /** These might cause problems */
      // const dataLayer = {
      //   'order-id': this.orderId,
      //   'order-date': this.orderDate,
      //   'order-website': this.orderStoreName,
      //   'order-total': this.orderGrandTotal,
      //   'order-subtotal': this.orderSubTotal,
      //   'order-tax': this.orderTaxAmount,
      //   'order-shipping': this.orderShippingAmount,
      //   'order-shipping-method': this.orderShippingDescription,
      //   'order-payment': this.paymentMethod,
      //   'order-currency-code': currencyCode,
      //   'order-promo-code': this.couponCode
      // }

      GTM.trackEvent({
        event: 'icmaa-checkout-success-view',
        // ...dataLayer,
        ecommerce: {
          currencyCode: currencyCode,
          purchase: {
            actionField: {
              action: 'purchase',
              id: this.orderId,
              affiliation: this.orderStoreName,
              revenue: this.orderGrandTotal,
              tax: this.orderTaxAmount,
              shipping: this.orderShippingAmount,
              shipping_method: this.orderShippingDescription,
              payment_method: this.paymentMethod,
              coupon: this.couponCode,
              couponrule: this.couponCodeRule
            },
            products: this.singleOrderItems
          }
        }
      })

      this.$store.dispatch('icmaaGoogleTagManager/setLastOrderId', this.orderId)
    }
  },
  beforeMount () {
    this.$bus.$on('checkout-success-last-order-loaded', this.checkoutSuccessGtm)
  },
  beforeDestroy () {
    this.$bus.$off('checkout-success-last-order-loaded', this.checkoutSuccessGtm)
  }
}
