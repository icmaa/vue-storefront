<template>
  <div class="card-frame">
    <!-- form will be added here -->
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
