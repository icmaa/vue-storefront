<template>
  <div class="t-text-sm">
    {{ info.description }}
  </div>
</template>

<script>
import MethodInfoBoxMixin from 'icmaa-payment/mixins/methods/InfoMixin'

export default {
  name: 'BankPaymentInfo',
  mixins: [ MethodInfoBoxMixin ]
}
</script>
