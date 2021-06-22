<template>
  <form>
    <base-input
      type="text"
      class="t-mb-2"
      v-model="additionalData.bic"
      :placeholder="$t('BIC')"
    />
    <base-input
      type="text"
      v-model="additionalData.account_iban"
      :placeholder="$t('Account IBAN')"
      :validations="[
        {
          condition: $v.additionalData.account_iban.$error && !$v.additionalData.account_iban.required,
          text: $t('Field is required')
        }
      ]"
    />
    <button-component
      class="t-w-full lg:t-w-auto t-mt-4"
      @click.native.stop="submit"
    >
      {{ $t('Continue') }}
    </button-component>
  </form>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import ApmMethod from 'icmaa-checkout-com/mixins/methods/ApmMethod'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput.vue'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  components: {
    BaseInput,
    ButtonComponent
  },
  mixins: [ApmMethod],
  data () {
    return {
      additionalData: {
        task: 'mandate',
        bic: null,
        account_iban: null
      }
    }
  },
  validations: {
    additionalData: {
      account_iban: {
        required
      }
    }
  },
  methods: {
    submit () {
      // console.log('FORM', form)
    }
  }
}
</script>
