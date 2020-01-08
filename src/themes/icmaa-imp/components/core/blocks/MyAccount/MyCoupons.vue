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
          :label="$t('Card number') + ' *'"
          v-model="coupon.number"
          @blur="$v.coupon.number.$touch()"
          :validations="[
            {
              condition: $v.coupon.number.$error && !$v.coupon.number.required,
              text: $t('Field is required')
            }
          ]"
        />
      </div>

      <div class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4">
        <base-input
          class=""
          type="password"
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
        <button-component type="primary" class="t-flex-1 lg:t-flex-fix" @click="loadCoupon">
          check coupon
        </button-component>
      </div>
      <template v-if="getCoupon.length > 0">
        <div class="t-flex t-w-full t-flex-wrap">
          <div class="t-w-full t-px-2 t-font-bold">
            {{ $t('Card number') }}
          </div>
          <div class="t-w-full t-px-2 t-mb-4">
            {{ getCoupon }}
          </div>
        </div>
      </template>
      <template v-if="getBalance >= 0">
        <div class="t-flex t-w-full t-flex-wrap">
          <div class="t-w-full t-px-2 t-font-bold">
            {{ $t('Balance') }}
          </div>
          <div class="t-w-full t-px-2 t-mb-4">
            {{ getBalance }} {{ getCurrency }}
          </div>
        </div>
      </template>
      <template v-if="getExpires !== null && getExpires.length > 0">
        <div class="t-flex t-w-full t-flex-wrap">
          <div class="t-w-full t-px-2 t-font-bold">
            {{ $t('Expires at') }}
          </div>
          <div class="t-w-full t-px-2 t-mb-4">
            {{ getExpires }}
          </div>
        </div>
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
        number: '',
        pin: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      getCoupon: 'icmaaCoupon/getCoupon',
      getBalance: 'icmaaCoupon/getCouponBalance',
      getCurrency: 'icmaaCoupon/getCouponCurrency',
      getExpires: 'icmaaCoupon/getCouponExpires'
    })
  },
  validations: {
    coupon: {
      number: {
        required
      },
      pin: {
        required,
        minLength: minLength(4)
      }
    }
  },
  methods: {
    async loadCoupon () {
      await this.$store.dispatch('icmaaCoupon/fetchCoupon', { number: this.coupon.number, pin: this.coupon.pin })
    }
  }
}
</script>
