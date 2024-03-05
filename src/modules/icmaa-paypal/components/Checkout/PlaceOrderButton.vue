<template>
  <PaypalCheckoutButton
    class="t-mt-8"
    :is-in-context="true"
    :form-validation="formValidation"
  />
</template>

<script>
import PaypalCheckoutButton from 'icmaa-paypal/components/Checkout/ButtonWrapper'

export default {
  name: 'PayPalPlaceOrderButton',
  components: {
    PaypalCheckoutButton
  },
  props: {
    formValidation: {
      type: Function,
      default: () => true
    }
  }
}
</script>
