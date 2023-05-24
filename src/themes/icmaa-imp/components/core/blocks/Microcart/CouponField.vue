<template>
  <div class="coupon-code t-flex t-items-end t-justify-between">
    <template v-if="hasCoupon">
      <BaseInput
        :placeholder="$t('Discount code')"
        icon="receipt"
        icon-position="left"
        name="couponCode"
        :value="$t('Coupon') + ': ' + coupon"
        :disabled="true"
        class="t-grow"
      />
      <ButtonComponent
        icon="close"
        :icon-only="true"
        class="t-ml-2"
        @click="removeCoupon"
      >
        {{ $t('Remove discount code') }}
      </ButtonComponent>
    </template>
    <template v-else>
      <BaseInput
        v-model.trim="couponCode"
        :placeholder="label || $t('Discount code')"
        name="couponCode"
        class="t-grow"
        @keyup.enter="applyCoupon"
      />
      <ButtonComponent
        v-if="couponCode.length > 0"
        icon="keyboard_arrow_right"
        :icon-only="true"
        :disabled="!couponCode"
        class="t-ml-2"
        @click="applyCoupon"
      >
        {{ $t('Add discount code') }}
      </ButtonComponent>
    </template>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n'

import ButtonComponent from 'theme/components/core/blocks/Button'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'

export default {
  name: 'MicrocartCouponField',
  components: {
    ButtonComponent,
    BaseInput
  },
  props: {
    coupon: {
      type: [String, Boolean],
      default: false
    },
    label: {
      type: [String, Boolean],
      default: false
    }
  },
  data () {
    return {
      couponCode: '',
      couponCodeButton: false
    }
  },
  computed: {
    hasCoupon () {
      return !!this.coupon
    }
  },
  methods: {
    async applyCoupon () {
      if (this.couponCode === '') {
        return
      }

      this.$store.dispatch('ui/loader', { message: i18n.t('Please wait') })
      this.$store.dispatch('cart/applyCoupon', this.couponCode)
        .then(response => {
          this.$store.dispatch('ui/loader', false)

          let type = 'success'
          let message = 'Your coupon has been successfully applied.'
          if (response.code === 200 && !!response.result) {
            this.couponCode = ''
          } else {
            type = 'error'
            message = 'You\'ve entered an incorrect coupon code. Please try again.'
          }

          message = i18n.t(message)

          this.$store.dispatch('notification/spawnNotification', {
            type, message, action1: { label: i18n.t('OK') }
          })
        })
    },
    async removeCoupon () {
      this.$store.dispatch('ui/loader', { message: i18n.t('Please wait') })
      this.$store.dispatch('cart/removeCoupon')
        .then(response => {
          this.$store.dispatch('ui/loader', false)

          let type = 'success'
          let message = 'Your coupon has been removed.'
          if (response.code === 200 && !!response.result) {
            this.couponCode = ''
          } else {
            type = 'error'
            message = 'There was an error while removing your coupon code. Please try again.'
          }

          message = i18n.t(message)

          this.$store.dispatch('notification/spawnNotification', {
            type, message, action1: { label: i18n.t('OK') }
          })
        })
    }
  }
}
</script>
