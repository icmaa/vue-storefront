<template>
  <div class="t-container t-p-4">
    <h1
      class="t-text-1xl t-font-bold"
      v-text="$t('Thank you for your purchase!')"
    />
    <h2
      class="t-mb-4 t-text-xl t-text-base-tone"
      v-text="$t('Your order has been received.')"
    />
    <div class="t-text-sm">
      <div class="t-mb-2">
        {{ $t('You will receive an order confirmation email with details of your order and a link to track its progress.') }}
      </div>
      <div v-if="order">
        {{ $t('Your order-number is:') }}
        <router-link
          v-if="isLoggedIn"
          class="t-font-mono t-text-base-tone lg:t-pl-2"
          :to="localizedRoute(`/my-account/orders/${order.id}`)"
        >
          #{{ order.increment_id }}
        </router-link>
        <span
          v-else
          class="t-font-mono t-text-base-tone lg:t-pl-2"
        >
          #{{ order.increment_id }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'

import CheckoutSuccessGtmMixin from 'icmaa-google-tag-manager/mixins/checkoutSuccessGtmCheckout'

export default {
  name: 'CheckoutSuccess',
  mixins: [ CheckoutSuccessGtmMixin ],
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn'
    })
  },
  mounted () {
    if (!this.isLoggedIn && !this.lastOrderToken) {
      this.$store.dispatch('user/loadOrdersFromCache')
    }
  },
  metaInfo () {
    return {
      title: i18n.t('Order complete').toString(),
      meta: [
        { vmid: 'robots', name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  }
}
</script>
