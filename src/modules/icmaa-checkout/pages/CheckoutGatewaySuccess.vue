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

    const { order, response } = this.gatewayOrder
    await this.$store.dispatch('checkout/finishPlaceOrder', { order, response })
    this.$store.dispatch('icmaaGoogleTagManager/setLastOrderId', response.result.orderId)

    this.$store.dispatch('checkout/setGatewayOrder', null)
    this.$store.dispatch('ui/loader', false)

    this.$router.push(this.localizedRoute('checkout-success'))
  }
}
</script>
