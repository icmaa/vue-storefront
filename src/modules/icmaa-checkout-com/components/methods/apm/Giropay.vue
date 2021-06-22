<template>
  <div>
    <base-input
      type="text"
      v-model="additionalData.bic"
      :placeholder="$t('BIC')" required :validations="[
        {
          condition: $v.additionalData.bic.$error && !$v.additionalData.bic.required,
          text: $t('Field is required')
        }
      ]"
    />
  </div>
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
        bic: null
      }
    }
  },
  validations: {
    additionalData: {
      bic: {
        required
      }
    }
  }
}
</script>
