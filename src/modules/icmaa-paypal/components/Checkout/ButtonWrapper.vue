<template>
  <PaypalCheckoutButton
    v-if="isLoaded"
    :color="color"
    :is-in-context="isInContext"
    :form-validation="formValidation"
  />
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
    },
    isInContext: {
      type: Boolean,
      default: false
    },
    formValidation: {
      type: Function,
      default: () => true
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
