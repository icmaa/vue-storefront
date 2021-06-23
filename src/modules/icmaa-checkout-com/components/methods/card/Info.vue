<template>
  <div class="t-pt-2">
    <div
      class="t-text-sm"
      v-text="info.description"
      v-if="info.description"
    />
    <div class="card-frame t-mt-2 t-h-10" />
  </div>
</template>

<script>

import MethodInfoBoxMixin from 'icmaa-payment/mixins/methods/InfoMixin'
import CardPaymentMethod from 'icmaa-checkout-com/mixins/methods/CardPaymentMethod'

export default {
  mixins: [
    MethodInfoBoxMixin,
    CardPaymentMethod
  ]
}
</script>
