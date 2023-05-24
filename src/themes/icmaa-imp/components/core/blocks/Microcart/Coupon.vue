<template>
  <div class="t-mb-4 t-border-b t-border-base-lightest t-pb-4">
    <coupon-field
      :coupon="currentCouponCodes"
      :class="{ 't-mb-4': coupon }"
    />
    <coupon-field
      v-if="coupon"
      :label="$t('Add another discount code')"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import CouponField from 'theme/components/core/blocks/Microcart/CouponField'

export default {
  name: 'MicrocartCoupon',
  components: {
    CouponField
  },
  computed: {
    ...mapGetters({
      coupon: 'cart/getCoupon',
      giftcert: 'cart/getGiftcert'
    }),
    currentCouponCodes () {
      const codes = new Set()

      if (this.coupon) codes.add(this.coupon.code)
      if (this.giftcert) codes.add(this.giftcert.code)

      return [...codes].join(', ')
    }
  }
}
</script>
