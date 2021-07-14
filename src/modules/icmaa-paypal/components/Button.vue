<template>
  <div id="paypal-button-container" class="t-flex" v-if="sdkLoaded" />
</template>

<script>
export default {
  name: 'PayPalButton',
  data () {
    return {
      // @todo Put this into config file
      clientId: 'ARrpPCWTSMu9x6I48yQuhPCBvNgugYfe7Twegv1YSmHeqXJ5onmCZ5bK0umPGR4B61hMg5tl8UzyOjQx',
      sdkLoaded: false
    }
  },
  async mounted () {
    await this.loadSdkScript()
    this.renderButton()
  },
  methods: {
    loadSdkScript () {
      return new Promise(resolve => {
        const script = document.createElement('script')
        script.async = true
        script.src = 'https://www.paypal.com/sdk/js?client-id=' + this.clientId
        script.onload = () => {
          this.sdkLoaded = true
          resolve()
        }
        document.body.appendChild(script)
      })
    },
    renderButton () {
      window.paypal
        .Buttons({
          style: {
            shape: 'rect',
            color: 'gold',
            layout: 'horizontal',
            label: 'checkout',
            tagline: false
          },
          createOrder: this.createOrder,
          onShippingChange: this.onShippingChange,
          onApprove: this.onApprove,
          onError: this.onError
        })
        .render('#paypal-button-container')
    },
    createOrder () {
      // ...

      console.error('PayPal', 'createOrder', arguments)
    },
    onShippingChange () {
      // ...

      console.error('PayPal', 'onShippingChange', arguments)
    },
    onApprove () {
      // ...

      console.error('PayPal', 'onApprove', arguments)
    },
    onError () {
      // ...

      console.error('PayPal', 'onError', arguments)
    }
  }
}
</script>
