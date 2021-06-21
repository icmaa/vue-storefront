export default {
  props: {
    code: {
      type: String,
      required: true
    }
  },
  methods: {
    setAdditionalInformation (data: any) {
      this.$store.dispatch(`checkoutcom_apm_${this.code}/setAdditionalInformation`, data)
    },
    setValidations (data: any) {
      this.$store.dispatch(`checkoutcom_apm_${this.code}/setValidations`, data)
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
