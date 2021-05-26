import { METHOD_CARD, PAYMENT_METHODS } from 'icmaa-checkout-com'

export default {
  props: {
    method: {
      type: [String, Boolean],
      required: true
    }
  },
  computed: {
    isCheckoutComMethod () {
      return PAYMENT_METHODS.indexOf(this.method) >= 0
    },
    isCardMethod () {
      return this.method === METHOD_CARD
    }
  }
}
