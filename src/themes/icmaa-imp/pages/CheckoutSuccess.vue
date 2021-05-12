<template>
  <div class="t-container t-p-4">
    <h1 class="t-font-bold t-text-1xl" v-text="$t('Thank you for your purchase!')" />
    <h2 class="t-text-xl t-text-base-tone t-mb-4" v-text="$t('Your order has been received.')" />
    <div class="t-text-sm">
      <div class="t-mb-2">
        {{ $t('You will receive an order confirmation email with details of your order and a link to track its progress.') }}
      </div>
      <div v-if="lastOrder">
        {{ $t('Your order-number is:') }}
        <router-link class="t-font-mono t-text-base-tone lg:t-pl-2" :to="localizedRoute(`/my-account/orders/${lastOrder.id}`)" v-if="isLoggedIn">
          #{{ lastOrder.increment_id }}
        </router-link>
        <span class="t-font-mono t-text-base-tone lg:t-pl-2" v-else>
          #{{ lastOrder.increment_id }}
        </span>
      </div>
      <google-customer-review type="batch" />
      <google-customer-review type="popup" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'

import GoogleCustomerReview from 'icmaa-google-tag-manager/components/GoogleCustomerReview'
import CheckoutSuccessGtmMixin from 'icmaa-google-tag-manager/mixins/checkoutSuccessGtm'

export default {
  name: 'ExternalCheckoutSuccess',
  components: {
    GoogleCustomerReview
  },
  mixins: [ CheckoutSuccessGtmMixin ],
  computed: {
    ...mapGetters({
      cartItems: 'cart/getCartItems',
      orderHistory: 'user/getOrdersHistory',
      isLoggedIn: 'user/isLoggedIn'
    }),
    lastOrder () {
      return this.orderHistory.length > 0 ? this.orderHistory[0] : false
    },
    cartIsNotEmpty () {
      return this.cartItems.length > 0
    }
  },
  methods: {
    async clearCart () {
      if (this.cartIsNotEmpty) {
        await this.$store.dispatch('cart/clear', {})
        await this.$store.dispatch('cart/sync', { forceClientState: true })
      }
    }
  },
  metaInfo () {
    return {
      title: i18n.t('Order complete'),
      meta: [
        { vmid: 'robots', name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  }
}
</script>
