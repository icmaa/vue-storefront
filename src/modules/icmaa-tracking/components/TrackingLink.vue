<template>
  <div v-if="validStatus" @click="followTracking">
    <slot>
      {{ $t('Shipment tracking') }}
    </slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import config from 'config'
import i18n from '@vue-storefront/i18n'

export default {
  name: 'TrackingLink',
  props: {
    orderId: {
      type: [Number, String],
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getTracking: 'icmaaTracking/getTrackingByOrderId',
      ordersHistory: 'user/getOrdersHistory',
      store: 'icmaaConfig/getCurrentStore'
    }),
    tracking () {
      return this.getTracking(this.orderId)
    },
    validStatus () {
      return config.icmaa_tracking.orderStatusWhitelist.includes(this.status)
    },
    order () {
      return this.ordersHistory.find(order =>
        parseInt(order.entity_id) === parseInt(this.orderId)
      )
    }
  },
  methods: {
    async followTracking () {
      this.$store.dispatch('ui/loader', { message: i18n.t('Please wait') })
      await this.$store.dispatch('icmaaTracking/fetchTracking', this.orderId)
      if (this.tracking) {
        const languageCode = this.store.storeCode
        const incrementId = this.order.increment_id + '-1'
        const address = this.order?.extension_attributes?.shipping_assignments[0]?.shipping.address ||
          this.order.billing_address
        const postcode = address.postcode

        this.$router.push({
          name: 'order-tracking',
          query: {
            'tracking-code': [
              languageCode,
              this.tracking.id,
              postcode,
              incrementId
            ].join('~')
          }
        })
      }
      this.$store.dispatch('ui/loader', false)
    }
  }
}

</script>
