<template>
  <div class="t-pt-2">
    <div
      v-if="info.description"
      class="t-text-sm"
      v-text="info.description"
    />
  </div>
</template>

<script>

import MethodInfoBoxMixin from 'icmaa-payment/mixins/methods/InfoMixin'

export default {
  name: 'IcmaaPaypalInfo',
  mixins: [
    MethodInfoBoxMixin
  ]
}
</script>
