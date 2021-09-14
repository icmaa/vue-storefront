<template>
  <div />
</template>

<script>

import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'

export default {
  name: 'CheckoutGatewaySuccess',
  computed: {
    ...mapGetters({
      gatewayOrder: 'checkout/getGatewayOrder'
    })
  },
  async beforeMount () {
    this.$store.dispatch('ui/loader', {
      active: true, message: i18n.t('Finishing your order')
    })

    await this.$store.dispatch('checkout/load')

    if (!this.gatewayOrder) {
      this.$router.push(this.localizedHomeRoute)
      this.$store.dispatch('ui/loader', false)
      return
    }

    await this.$store.dispatch('checkout/finishPlaceOrder', this.gatewayOrder)
    this.$store.dispatch('icmaaGoogleTagManager/setLastOrderId', this.gatewayOrder.order.orderId)

    this.$store.dispatch('checkout/setGatewayOrder', null)
    this.$store.dispatch('ui/loader', false)

    this.$router.push(this.localizedRoute('checkout-success'))
  }
}
</script>
