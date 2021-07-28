<template>
  <paypal-checkout-button v-if="isLoaded" />
</template>

<script>
import initStore from 'icmaa-paypal/helpers/initStore'

const PaypalCheckoutButton = () => import(/* webpackChunkName: "icmaa-paypal-button" */ 'icmaa-paypal/components/Checkout/Button')

export default {
  name: 'PayPalButtonWrapper',
  components: {
    PaypalCheckoutButton
  },
  data () {
    return {
      isLoaded: false
    }
  },
  async mounted () {
    this.isLoaded = await initStore(this.$store)
  }
}
</script>
