import Vue from 'vue'
import { getCookieHostname } from 'icmaa-external-checkout/helper'

import CheckoutSuccessGtmMixin from 'icmaa-google-tag-manager/mixins/checkoutSuccessGtm'

export default {
  mixins: [ CheckoutSuccessGtmMixin ],
  methods: {
    isRecentOrder (): boolean {
      const cookie = Vue.$cookies.get('vsf_token_recentorder')
      return !!cookie && cookie === '1'
    },
    removeRecentOrderCookie (): void {
      Vue.$cookies.remove('vsf_token_recentorder', undefined, getCookieHostname())
    }
  },
  beforeMount () {
    this.$bus.$on('icmaa-external-checkout-user-data-complete', this.checkoutSuccessGtm)
  },
  beforeDestroy () {
    this.$bus.$off('icmaa-external-checkout-user-data-complete', this.checkoutSuccessGtm)
  }
}
