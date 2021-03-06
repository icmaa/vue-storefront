<template>
  <div class="coupon-code t-flex t-items-end t-justify-between">
    <template v-if="hasCoupon">
      <base-input :placeholder="$t('Discount code')" icon="receipt" icon-position="left" name="couponCode" :value="$t('Coupon') + ': ' + coupon" :disabled="true" class="t-flex-grow" />
      <button-component icon="close" :icon-only="true" @click="removeCoupon" class="t-ml-2">
        {{ $t('Remove discount code') }}
      </button-component>
    </template>
    <template v-else>
      <base-input :placeholder="label || $t('Discount code')" name="couponCode" v-model.trim="couponCode" @keyup.enter="applyCoupon" class="t-flex-grow" />
      <button-component icon="keyboard_arrow_right" :icon-only="true" :disabled="!couponCode" @click="applyCoupon" class="t-ml-2" v-if="couponCode.length > 0">
        {{ $t('Add discount code') }}
      </button-component>
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

      this.$bus.$emit('notification-progress-start', i18n.t('Please wait'))
      this.$store.dispatch('cart/applyCoupon', this.couponCode)
        .then(status => {
          this.$bus.$emit('notification-progress-stop')

          let type = 'success'
          let message = 'Your coupon has been successfully applied.'
          if (status) {
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
      this.$bus.$emit('notification-progress-start', i18n.t('Please wait'))
      this.$store.dispatch('cart/removeCoupon')
        .then(status => {
          this.$bus.$emit('notification-progress-stop')

          let type = 'success'
          let message = 'Your coupon has been removed.'
          if (status) {
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
