<template>
  <div class="t-relative" v-if="show">
    <div class="cl-error" v-if="error">
      {{ error }}
    </div>
    {{ code }}: Additional data here ...
  </div>
</template>

<script>

import MethodInfoBoxMixin from 'icmaa-payment/mixins/methods/InfoMixin'

export default {
  name: 'CheckoutComApmInfo',
  mixins: [ MethodInfoBoxMixin ],
  data () {
    return {
      error: null
    }
  }
}
</script>
