<template>
  <div class="t-p-4 t-bg-white">
    <headline icon="mail">
      {{ $t('My coupons') }}
    </headline>

    <div class="t-w-full t-flex t-flex-wrap">
      <div class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4">
        <base-input
          class=""
          type="text"
          name="code"
          :label="$t('Coupon') + ' *'"
          v-model="coupon.code"
          mask="X-XXXXX-XXXXX"
          @blur="$v.coupon.code.$touch()"
          :validations="[
            {
              condition: $v.coupon.code.$error && !$v.coupon.code.required,
              text: $t('Field is required')
            }
          ]"
        />
      </div>

      <div class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4">
        <base-input
          class=""
          type="number"
          name="pin"
          mask="####"
          :label="$t('Pin') + ' *'"
          v-model="coupon.pin"
          @blur="$v.coupon.pin.$touch()"
          :validations="[
            {
              condition: $v.coupon.pin.$error && !$v.coupon.pin.required,
              text: $t('Field is required')
            },
            {
              condition: !$v.coupon.pin.minlength && $v.coupon.pin.$error,
              text: $t('Pin must have 4 digits.')
            }
          ]"
        />
      </div>

      <div class="t-px-2 t-w-full t-mb-4">
        <button-component type="primary" class="t-flex-1 lg:t-flex-fix" @click="checkCoupon">
          check coupon
        </button-component>
      </div>
      <template v-if="coupon.credit > 0">
        <div class="t-flex t-w-full t-px-2 t-mb-4">Your credit is {{ coupon.credit }} €</div>
      </template>
       <template v-if="coupon.expires.length > 0">
        <div class="t-flex t-w-full t-px-2 t-mb-4">Expires on: {{ coupon.expires }}</div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Headline from 'theme/components/core/blocks/MyAccount/Headline'
import i18n from '@vue-storefront/i18n'
import { required, minLength } from 'vuelidate/lib/validators'
import ButtonComponent from 'theme/components/core/blocks/Button'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'

export default {
  name: 'MyCoupons',
  components: {
    ButtonComponent,
    BaseInput,
    Headline
  },
  data () {
    return {
      coupon: {
        code: '',
        pin: '',
        credit: 0,
        expires: ''
      }
    }
  },
  validations: {
    coupon: {
      code: {
        required
      },
      pin: {
        required,
        minLength: minLength(4)
      }
    }
  },
  methods: {
    async checkCoupon () {
      this.coupon.credit = 555
      const credit = await this.$store.dispatch('icmaaCoupon/fetchCouponCredit', { coupon: this.coupon.code, pin: this.coupon.pin })
    }
  }
}
</script>
