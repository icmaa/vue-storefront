<template>
  <div>
    <base-input
      type="text"
      id="bic"
      name="bic"
      v-model="additionalData.bic"
      :placeholder="$t('BIC')"
      :validations="[
        {
          condition: $v.additionalData.bic.$error && !$v.additionalData.bic.required,
          text: $t('Field is required')
        },
        {
          condition: $v.additionalData.bic.$error && !$v.additionalData.bic.format,
          text: $t('Wrong format for your BIC')
        }
      ]"
    />
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { bic } from 'icmaa-checkout-com/helpers/validators'
import ApmMethod from 'icmaa-checkout-com/mixins/methods/ApmMethod'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput.vue'

export default {
  name: 'CheckoutComIdealInfo',
  mixins: [ ApmMethod ],
  components: {
    BaseInput
  },
  data () {
    return {
      additionalData: {
        bic: null
      }
    }
  },
  validations: {
    additionalData: {
      bic: {
        required,
        format: bic
      }
    }
  }
}
</script>
