<template>
  <div class="order-review">
    <div v-if="active">
      <p class="t-mb-4 t-text-sm">
        {{ $t('Please check if your order data is correct.') }}
      </p>
      <base-checkbox
        name="acceptTermsCheckbox"
        id="acceptTermsCheckbox"
        v-model="terms"
        :validations="[{
          condition: $v.terms.$error && (!$v.terms.required || !$v.terms.notFalse),
          text: $t('Field is required')
        }]"
      >
        {{ $t('I agree to terms and conditions') }}
      </base-checkbox>
      <button-component
        class="t-w-full lg:t-w-auto t-mt-8"
        :class="{ 't-opacity-50': $v.$dirty && $v.$invalid }"
        type="primary"
        @click.native.stop="submit"
      >
        {{ $t(('Place order')) }}
      </button-component>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { notFalse } from 'icmaa-config/helpers/validators'

import Review from 'icmaa-checkout/components/Review'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  mixins: [ Review ],
  components: {
    BaseCheckbox,
    ButtonComponent
  },
  validations: {
    terms: {
      required,
      notFalse
    }
  }
}
</script>
