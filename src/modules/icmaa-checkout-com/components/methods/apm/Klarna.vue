<template>
  <div class="klarna-widget t-text-sm">
    <div v-text="'SDK is initialized'" v-if="sdkInit" />
    <pre>{{ info }}</pre>
  </div>
</template>

<script>

import ApmMethod from 'icmaa-checkout-com/mixins/methods/ApmMethod'

export default {
  name: 'CheckoutComKlarnaInfo',
  mixins: [ ApmMethod ],
  data () {
    return {
      sdkInit: false
    }
  },
  async mounted () {
    await new Promise(resolve => {
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://x.klarnacdn.net/kp/lib/v1/api.js'
      script.onload = () => { resolve() }
      document.body.appendChild(script)
    })

    this.sdkInit = true
  }
}
</script>
