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
      class="t-mb-4"
    />
    <base-checkbox
      name="terms"
      id="terms"
      v-model="additionalData.terms"
      :validations="[{
        condition: $v.additionalData.terms.$error && (!$v.additionalData.terms.required || !$v.additionalData.terms.notFalse),
        text: $t('Field is required')
      }]"
      checkbox-class="t-self-start"
    >
      {{ info.terms }}
    </base-checkbox>
  </form>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { iban, bic } from 'icmaa-checkout-com/helpers/validators'
import { notFalse } from 'icmaa-config/helpers/validators'

import ApmMethod from 'icmaa-checkout-com/mixins/methods/ApmMethod'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'

export default {
  name: 'CheckoutComSepaInfo',
  mixins: [ ApmMethod ],
  components: {
    BaseInput,
    BaseCheckbox
  },
  data () {
    return {
      additionalData: {
        task: 'mandate',
        bic: null,
        iban: null,
        terms: false
      }
    }
  },
  validations: {
    additionalData: {
      iban: {
        required,
        format: iban
      },
      bic: {
        format: bic
      },
      terms: {
        required,
        notFalse
      }
    }
  }
}
</script>
