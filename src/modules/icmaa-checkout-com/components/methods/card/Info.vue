<template>
  <div class="t-pt-2">
    <div
      class="t-text-sm"
      v-text="info.description"
      v-if="info.description"
    />
    <div class="card-frame t-h-10 t-border t-border-base-light t-rounded-sm t-mt-4" />
    <validation-messages :validations="[
      {
        condition: $v.isValid.$error && (!$v.isValid.notFalse || !$v.isValid.required),
        text: $t('Please validate your card information')
      }
    ]"
    />
  </div>
</template>

<script>

import MethodInfoBoxMixin from 'icmaa-payment/mixins/methods/InfoMixin'
import CardPaymentMethod from 'icmaa-checkout-com/mixins/methods/CardPaymentMethod'
import ValidationMessages from 'theme/components/core/blocks/Form/ValidationMessages.vue'

export default {
  name: 'CheckoutComCCInfo',
  components: {
    ValidationMessages
  },
  mixins: [
    MethodInfoBoxMixin,
    CardPaymentMethod
  ]
}
</script>

<style lang="scss">

.frame--invalid {
  @apply t-border-alert;
}

</style>
