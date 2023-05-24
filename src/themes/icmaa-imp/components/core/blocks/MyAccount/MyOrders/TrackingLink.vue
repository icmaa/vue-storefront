<template>
  <div
    v-if="!!trackingId"
    @click="followTracking"
  >
    <slot>
      {{ $t('Shipment tracking') }}
    </slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TrackingLink',
  props: {
    orderId: {
      type: [Number, String],
      required: true
    }
  },
  computed: {
    ...mapGetters({
      ordersHistory: 'user/getOrdersHistory',
      store: 'icmaaConfig/getCurrentStore'
    }),
    trackingId () {
      return this.order.tracking_id
    },
    order () {
      return this.ordersHistory.find(order =>
        parseInt(order.entity_id) === parseInt(this.orderId)
      )
    }
  },
  methods: {
    async followTracking () {
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
            this.trackingId,
            postcode,
            incrementId
          ].join('~')
        }
      })
    }
  }
}

</script>
