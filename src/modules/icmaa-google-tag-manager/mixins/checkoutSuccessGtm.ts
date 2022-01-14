import Vue from 'vue'
import VueGtm from 'vue-gtm'
import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { googleTagManager } from 'config'
import { formatValue } from 'icmaa-config/helpers/price'
import { toDate } from 'icmaa-config/helpers/datetime'
import omit from 'lodash-es/omit'
import pick from 'lodash-es/pick'
import round from 'lodash-es/round'

export default {
  computed: {
    ...mapGetters({
      orderHistory: 'user/getOrdersHistory',
      isGtmEnabled: 'icmaaGoogleTagManager/enabled',
      getGTMProductDTO: 'icmaaGoogleTagManager/getProductDTO'
    }),
    order () {
      return this.orderHistory && this.orderHistory.length > 0 ? this.orderHistory[0] : false
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
    shippingMethod () {
      return this.order.shipping_method
    },
    paymentMethod () {
      return this.order.payment.method
    },
    couponCode () {
      return this.order.coupon_code ? String(this.order.coupon_code) : null
    },
    couponCodeRule () {
      return this.order.coupon_rule_name
    },
    singleOrderItems () {
      const itemAttributeMap = ['base_price', 'base_tax_amount', 'discount_amount']
      return this.order.items
        ?.map(i => {
          let product = this.order.products?.find(p => p.sku === i.sku || (p.configurable_children?.some(c => c.sku === i.sku))) || {}
          product = Object.assign(product, pick(i, itemAttributeMap))
          const productDTO = this.getGTMProductDTO(product)
          const additionalData = { sku: i.sku, quantity: round(i.qty_ordered), id: String(productDTO.id).toString(), discountAmountExcludingTax: formatValue(i.discount_amount / ((i.tax_percent / 100) + 1), 'en-US') }
          return Object.assign(productDTO, additionalData)
        })
        .map(p => omit(p, ['children']))
    }
  },
  methods: {
    checkoutSuccessGtm () {
      if (!this.isGtmEnabled || !this.order || !this.isRecentOrder()) {
        this.removeRecentOrder()
        return
      }

      const GTM: VueGtm = (Vue as any).gtm

      const storeView = currentStoreView()
      const currencyCode = storeView.i18n.currencyCode

      GTM.trackEvent({
        event: 'icmaa-checkout-success',
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
              shipping_method: this.shippingMethod,
              payment_method: this.paymentMethod,
              coupon: this.couponCode,
              couponrule: this.couponCodeRule
            },
            products: this.singleOrderItems
          }
        }
      })

      this.removeRecentOrder()
    }
  },
  async mounted () {
    const filterValues = googleTagManager.productAttributes
      .filter(a => a.type && a.type === 'attribute')
      .map(a => a.field)
    await this.$store.dispatch('attribute/list', { filterValues })
  }
}
