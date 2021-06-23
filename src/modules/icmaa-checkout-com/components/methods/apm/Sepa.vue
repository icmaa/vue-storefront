<template>
  <form>
    <base-input
      type="text"
      v-model="additionalData.iban"
      :placeholder="$t('IBAN')"
      :validations="[
        {
          condition: $v.additionalData.iban.$error && !$v.additionalData.iban.required,
          text: $t('Field is required')
        },
        {
          condition: $v.additionalData.iban.$error && !$v.additionalData.iban.format,
          text: $t('Wrong format for your IBAN')
        }
      ]"
      class="t-mb-4"
    />
    <base-input
      type="text"
      v-model="additionalData.bic"
      :placeholder="$t('BIC')"
      :validations="[
        {
          condition: $v.additionalData.bic.$error && !$v.additionalData.bic.format,
          text: $t('Wrong format for your BIC')
        }
      ]"
    />
  </form>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import ApmMethod from 'icmaa-checkout-com/mixins/methods/ApmMethod'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput.vue'

export default {
  components: {
    BaseInput
  },
  mixins: [ApmMethod],
  data () {
    return {
      additionalData: {
        task: 'mandate',
        bic: null,
        iban: null
      }
    }
  },
  validations: {
    additionalData: {
      iban: {
        required,
        format: (v) => {
          return /[A-Z]{2}\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?[\d]{0,2}/.test(v)
        }
      },
      bic: {
        format: (v) => {
          return /([a-zA-Z]{4})([a-zA-Z]{2})(([2-9a-zA-Z]{1})([0-9a-np-zA-NP-Z]{1}))((([0-9a-wy-zA-WY-Z]{1})([0-9a-zA-Z]{2}))|([xX]{3})|)/.test(v)
        }
      }
    }
  }
}
</script>
