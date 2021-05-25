<template>
  <div class="order-review">
    <div v-if="active">
      <p class="t-mb-4 t-text-sm">
        {{ $t('Please check if your order data is correct.') }}
      </p>
      <template v-if="hasAgreements">
        <base-checkbox
          v-for="agreement in agreements"
          :key="agreement.id"
          name="terms"
          :id="`terms-${agreement.id}`"
          v-model="terms"
          :input-value="String(agreement.id)"
          :validations="[{
            condition: $v.terms.$error && (!$v.terms.required || !$v.terms.notFalse),
            text: $t('Field is required')
          }]"
        >
          {{ agreement.checkboxText }}
        </base-checkbox>
      </template>
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
import { required, minLength } from 'vuelidate/lib/validators'

import Review from 'icmaa-checkout/components/Review'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  mixins: [ Review ],
  components: {
    BaseCheckbox,
    ButtonComponent
  },
  validations () {
    let agreements = {}
    if (this.hasAgreements) {
      agreements = {
        terms: {
          required,
          minLength: minLength(this.agreements.length)
        }
      }
    }

    return {
      ...agreements
    }
  }
}
</script>
