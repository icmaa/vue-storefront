<template>
  <div>
    <BaseSelect
      id="bic"
      v-model="additionalData.bic"
      type="text"
      name="bic"
      :initial-option-text="$t('BIC')"
      :options="issuer"
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
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'

export default {
  name: 'CheckoutComIdealInfo',
  components: {
    BaseSelect
  },
  mixins: [ ApmMethod ],
  data () {
    return {
      additionalData: {
        bic: null
      }
    }
  },
  computed: {
    issuer () {
      const options = []
      const issuer = this.info?.issuer || []
      issuer.forEach(country => {
        const { name, issuers } = country
        issuers.forEach(i => {
          options.push({
            label: `${i.name} (${name})`,
            value: i.bic
          })
        })
      })

      return options
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
