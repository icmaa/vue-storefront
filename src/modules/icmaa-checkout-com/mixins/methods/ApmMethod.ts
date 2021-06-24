import MethodInfoBoxMixin from 'icmaa-payment/mixins/methods/InfoMixin'

export default {
  mixins: [ MethodInfoBoxMixin ],
  props: {
    apmMethodCode: {
      type: String,
      required: true
    }
  },
  methods: {
    setAdditionalInformation (data: any) {
      this.$store.dispatch(`checkoutcom_apm_${this.apmMethodCode}/setAdditionalInformation`, data)
    },
    setValidations (data: any) {
      this.$store.dispatch(`checkoutcom_apm_${this.apmMethodCode}/setValidations`, data)
    }
  },
  mounted () {
    this.setValidations(this.$v)
  },
  watch: {
    additionalData: {
      handler (data: any) {
        this.setAdditionalInformation(data)
      },
      deep: true
    }
  }
}
