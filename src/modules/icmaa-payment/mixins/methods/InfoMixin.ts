import { mapGetters } from 'vuex'

export default {
  props: {
    code: {
      type: String,
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
