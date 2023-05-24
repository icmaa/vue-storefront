<template>
  <form>
    <BaseInput
      id="iban"
      v-model="additionalData.iban"
      type="text"
      name="iban"
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
    <BaseInput
      id="bic"
      v-model="additionalData.bic"
      type="text"
      name="bic"
      :placeholder="$t('BIC')"
      :validations="[
        {
          condition: $v.additionalData.bic.$error && !$v.additionalData.bic.format,
          text: $t('Wrong format for your BIC')
        }
      ]"
      class="t-mb-4"
    />
    <BaseCheckbox
      id="terms"
      v-model="additionalData.terms"
      name="terms"
      :validations="[{
        condition: $v.additionalData.terms.$error && (!$v.additionalData.terms.required || !$v.additionalData.terms.notFalse),
        text: $t('Field is required')
      }]"
      checkbox-class="t-self-start"
    >
      {{ info.terms }}
    </BaseCheckbox>
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
  components: {
    BaseInput,
    BaseCheckbox
  },
  mixins: [ ApmMethod ],
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
