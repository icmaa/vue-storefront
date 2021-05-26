<template>
  <div v-if="isCheckoutComMethod">
    <card v-if="isCardMethod" />
  </div>
</template>

<script>
import Payment from 'icmaa-checkout-com/mixins/Payment'

import Card from './Card'

export default {
  mixins: [
    Payment
  ],
  components: {
    Card
  }
}
</script>
