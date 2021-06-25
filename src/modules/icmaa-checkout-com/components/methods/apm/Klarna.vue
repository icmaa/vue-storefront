<template>
  <div class="t-text-sm">
    <div v-text="error" v-if="error" class="t-text-sm t-text-alert t-mb-4" />
    <div id="klarna_container" />
  </div>
</template>

<script>

import ApmMethod from 'icmaa-checkout-com/mixins/methods/ApmMethod'

export default {
  name: 'CheckoutComKlarnaInfo',
  mixins: [ ApmMethod ],
  data () {
    return {
      sdkLoaded: false,
      widgetLoaded: false,
      error: null
    }
  },
  computed: {
    clientToken () {
      return this.info.clientToken
    },
    paymentMethods () {
      return this.info.paymentMethods
    }
  },
  async mounted () {
    window.klarnaAsyncCallback = this.klarnaAsyncCallback
    await this.loadSdkScript()
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
      this.sdkLoaded = true

      try {
        const k = window.Klarna.Payments.init({
          client_token: this.clientToken
        });

        k.load(
          {
            container: '#klarna_container',
            payment_method_categories: this.paymentMethods.map(m => m.identifier),
            instance_id: 'icmaa-klarna-payments-instance'
          },
          {},
          () => {
            this.widgetLoaded = true
          }
        )
      } catch (e) {
        this.error = e.message
        console.error(e)
      }
    }
  }
}
</script>
