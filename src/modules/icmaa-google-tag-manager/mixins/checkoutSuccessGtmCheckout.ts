import { mapGetters } from 'vuex'
import CheckoutSuccessGtmMixin from 'icmaa-google-tag-manager/mixins/checkoutSuccessGtm'

export default {
  mixins: [ CheckoutSuccessGtmMixin ],
  computed: {
    ...mapGetters({
      gtmLastOrderId: 'icmaaGoogleTagManager/getLastOrderId'
    })
  },
  methods: {
    isRecentOrder (): boolean {
      return !!this.gtmLastOrderId
    },
    removeRecentOrder (): Promise<void> {
      return this.$store.dispatch('icmaaGoogleTagManager/setLastOrderId', null)
    }
  },
  mounted () {
    this.checkoutSuccessGtm()
  }
}
