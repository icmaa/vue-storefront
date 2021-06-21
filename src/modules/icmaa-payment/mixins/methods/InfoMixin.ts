import { mapGetters } from 'vuex'

export default {
  props: {
    code: {
      type: String,
      required: true
    },
    method: {
      type: [Object, Boolean],
      required: true
    }
  },
  computed: {
    ...mapGetters({
      'getPaymentMethodByCode': 'checkout/getPaymentMethodByCode'
    }),
    payment () {
      return this.getPaymentMethodByCode(this.code)
    },
    info () {
      return this.payment.info || {}
    }
  }
}
