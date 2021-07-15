<template>
  <paypal-bypass-button v-if="isLoaded" />
</template>

<script>
import initStore from 'icmaa-paypal/helpers/initStore'

const PaypalBypassButton = () => import(/* webpackChunkName: "icmaa-paypal-button" */ 'icmaa-paypal/components/Bypass/Button')

export default {
  name: 'PayPalButtonWrapper',
  components: {
    PaypalBypassButton
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
