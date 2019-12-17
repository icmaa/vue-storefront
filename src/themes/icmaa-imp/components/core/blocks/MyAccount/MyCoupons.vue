<template>
  <div class="t-p-4 t-bg-white">
    <headline icon="mail">
      {{ $t('My coupons') }}
    </headline>

    <div class="t-w-full t-px-2">
      <base-input
        class="mb10"
        type="text"
        name="text"
        :placeholder="$t('Coupon code')"
        v-model="coupon.code"
        @blur="$v.coupon.code.$touch()"
        :validations="[
          {
            condition: $v.coupon.code.$error && !$v.coupon.code.required,
            text: $t('Field is required')
          },
          {
            condition: !$v.coupon.code.minLength,
            text: $t('Name must have at least 2 letters.')
          }
        ]"
      />

      <base-input
        class="mb10"
        type="number"
        name="pin"
        :placeholder="$t('Pin')"
        v-model="coupon.pin"
        @blur="$v.coupon.pin.$touch()"
        :validations="[
          {
            condition: $v.coupon.pin.$error && !$v.coupon.pin.required,
            text: $t('Field is required')
          },
          {
            condition: !$v.coupon.pin.minlength,
            text: $t('Pin must have 4 digits.')
          }
        ]"
      />

      <button-component type="primary" class="t-flex-1 lg:t-flex-fix">
        check coupons
      </button-component>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Headline from 'theme/components/core/blocks/MyAccount/Headline'
import i18n from '@vue-storefront/i18n'
import { required, minLength, helpers } from 'vuelidate/lib/validators'
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
        pin: ''
      }
    }
  },
  validations: {
    coupon: {
      code: {
        required,
        minLength: minLength(5)
      },
      pin: {
        required,
        minLength: minLength(4)
      }
    }
  }
}
</script>
