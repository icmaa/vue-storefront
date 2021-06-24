<template>
  <div class="t-text-sm">
    <div v-text="error" v-if="error" />
    <div id="klarna_container" />
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
      sdkInit: false,
      error: null
    }
  },
  async mounted () {
    window.klarnaAsyncCallback = this.klarnaAsyncCallback
    await this.loadSdkScript()
    this.sdkInit = true
  },
  methods: {
    loadSdkScript () {
      return new Promise(resolve => {
        const script = document.createElement('script')
        script.async = true
        script.src = 'https://x.klarnacdn.net/kp/lib/v1/api.js'
        script.onload = () => { resolve() }
        document.body.appendChild(script)
      })
    },
    klarnaAsyncCallback () {
      console.error('klarnaAsyncCallback')

      try {
        window.Klarna.Payments.init({
          client_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ.dtxWM6MIcgoeMgH87tGvsNDY6cH'
        });
      } catch (e) {
        this.error = e.message
        console.error(e)
      }
    }
  }
}
</script>
