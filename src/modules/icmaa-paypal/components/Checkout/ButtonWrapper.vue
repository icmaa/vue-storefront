<template>
  <paypal-checkout-button v-if="isLoaded" :color="color" />
</template>

<script>
import initStore from 'icmaa-paypal/helpers/initStore'

const PaypalCheckoutButton = () => import(/* webpackChunkName: "icmaa-paypal-button" */ 'icmaa-paypal/components/Checkout/Button')

export default {
  name: 'PayPalButtonWrapper',
  components: {
    PaypalCheckoutButton
  },
  props: {
    color: {
      type: String,
      default: 'gold',
      validator: (v) => ['gold', 'blue', 'silver', 'white', 'black'].includes(v)
    }
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
