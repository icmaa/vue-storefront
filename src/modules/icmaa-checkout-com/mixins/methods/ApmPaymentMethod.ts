import { mapGetters } from 'vuex';

export default {
  data () {
    return {
      selected: null
    }
  },
  props: {
    apm: {
      type: Object,
      default: null
    }
  },
  watch: {
    'selected': function (code) {
      this.$store.dispatch('checkoutcom_apm/select', code)
    }
  },
  computed: {
    ...mapGetters({
      apmList: 'checkoutcom_apm/getApmList',
      apmMap: 'checkoutcom_apm/getApmMap',
      error: 'checkoutcom_apm/getErrorMsg',
      isLoading: 'checkoutcom_apm/isLoading'
    }),

    paymentMethods () {
      const methods = []

      this.apmList.forEach(apm => {
        if (this.apmMap[apm.id] !== undefined) {
          methods.push({
            ...apm,
            component: this.apmMap[apm.id]
          })
        }
      })

      return methods
    }
  }
}
