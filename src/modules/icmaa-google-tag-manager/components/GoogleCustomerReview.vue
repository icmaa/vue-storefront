<template>
  <div v-if="type === 'batch'">
    <g:ratingbadge :merchant_id="merchantId" />
  </div>
</template>

<script>
import { icmaa } from 'config'
import { mapGetters } from 'vuex'
import { isServer } from '@vue-storefront/core/helpers'
import { toDayjsDate } from 'icmaa-config/helpers/datetime'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  name: 'GoogleCustomerReview',
  props: {
    type: {
      type: String,
      default: 'popup',
      validator: (value) => ['popup', 'batch'].includes(value)
    }
  },
  computed: {
    ...mapGetters({
      orderHistory: 'user/getOrdersHistory'
    }),
    merchantId () {
      return icmaa.googleCustomerReview.merchantId
    },
    order () {
      return this.orderHistory.length > 0 ? this.orderHistory[0] : false
    },
    shippingAddress () {
      return this.order && this.order.extension_attributes.shipping_assignments[0].shipping.address
    },
    deliveryDate () {
      return toDayjsDate(this.order.created_at)
        .add(icmaa.googleCustomerReview.shippingOffset, 'd')
        .format('YYYY-MM-DD')
    },
    orderDTO () {
      return {
        'merchant_id': this.merchantId,
        'order_id': this.order.increment_id,
        'email': this.order.customer_email,
        'delivery_country': this.shippingAddress.country_id,
        'estimated_delivery_date': this.deliveryDate
      }
    }
  },
  methods: {
    async loadScript () {
      return new Promise(resolve => {
        if (!this.hasScript() && (window && !window.gapi)) {
          window.renderOptIn = this.renderOptIn

          const script = document.createElement('script');
          script.async = true;
          script.src = `https://apis.google.com/js/platform.js`
          script.onload = () => {
            resolve()
          }

          document.body.appendChild(script)
        }

        if (this.hasScript() && (window && window.gapi)) {
          resolve()
        }
      })
    },
    hasScript () {
      return Array
        .from(document.getElementsByTagName('script'))
        .some(script => script.src.includes('apis.google.com/js/platform.js'))
    },
    renderOptIn () {
      window.gapi.load('surveyoptin', () => {
        window.gapi.surveyoptin.render(this.orderDTO)
      })
    },
    renderBadge () {
      var ratingBadgeContainer = document.createElement('div');
      document.body.appendChild(ratingBadgeContainer);
      window.gapi.load('ratingbadge', () => {
        window.gapi.ratingbadge.render(
          ratingBadgeContainer, {
            'merchant_id': this.merchantId,
            'position': 'INLINE'
          })
      })

      window.___gcfg = {
        lang: currentStoreView.storeCode === 'de' ? 'de' : 'en'
      }
    },
    async onCheckoutSuccessLastOrderLoaded () {
      await this.loadScript()
      this.renderOptIn()

      this.$bus.$off(
        'checkout-success-last-order-loaded',
        this.onCheckoutSuccessLastOrderLoaded
      )
    }
  },
  async mounted () {
    if (!isServer) {
      switch (this.type) {
        case 'batch':
          await this.loadScript()
          this.renderBadge()
          break
        case 'popup':
          this.$bus.$on(
            'checkout-success-last-order-loaded',
            this.onCheckoutSuccessLastOrderLoaded
          )
          break
      }
    }
  },
  beforeDestroy () {
    this.$bus.$off(
      'checkout-success-last-order-loaded',
      this.onCheckoutSuccessLastOrderLoaded
    )
  }
}
</script>
