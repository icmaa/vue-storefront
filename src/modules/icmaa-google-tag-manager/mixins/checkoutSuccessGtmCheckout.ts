import CheckoutSuccessGtmMixin from 'icmaa-google-tag-manager/mixins/checkoutSuccessGtm'

export default {
  mixins: [ CheckoutSuccessGtmMixin ],
  methods: {
    isRecentOrder (): boolean {
      return !!this.lastOrderToken
    },
    removeRecentOrder (): Promise<void> {
      return this.$store.dispatch('checkout/setLastOrderToken', null)
    }
  },
  beforeMount () {
    this.$bus.$on('icmaa-checkout-user-data-complete', this.checkoutSuccessGtm)
  },
  beforeDestroy () {
    this.$bus.$off('icmaa-checkout-user-data-complete', this.checkoutSuccessGtm)
  }
}
