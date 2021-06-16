<template>
  <div class="t-container t-p-4">
    <h1 class="t-font-bold t-text-1xl" v-text="$t('Thank you for your purchase!')" />
    <h2 class="t-text-xl t-text-base-tone t-mb-4" v-text="$t('Your order has been received.')" />
    <div class="t-text-sm">
      <div class="t-mb-2">
        {{ $t('You will receive an order confirmation email with details of your order and a link to track its progress.') }}
      </div>
      <div v-if="order">
        {{ $t('Your order-number is:') }}
        <router-link class="t-font-mono t-text-base-tone lg:t-pl-2" :to="localizedRoute(`/my-account/orders/${order.id}`)" v-if="isLoggedIn">
          #{{ order.increment_id }}
        </router-link>
        <span class="t-font-mono t-text-base-tone lg:t-pl-2" v-else>
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
      lastOrderToken: 'checkout/getLastOrderToken',
      isLoggedIn: 'user/isLoggedIn'
    })
  },
  methods: {
    async loadLastOrder () {
      if (this.lastOrderToken) {
        await this.$store.dispatch('user/loadOrderByToken', { token: this.lastOrderToken })
        this.$bus.$emit('icmaa-checkout-user-data-complete', null)
      }
    }
  },
  async mounted () {
    if (!this.isLoggedIn && !this.lastOrderToken) {
      await this.$store.dispatch('user/loadOrdersFromCache')
    }

    this.loadLastOrder()
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
