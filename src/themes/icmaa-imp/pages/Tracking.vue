<template>
  <div class="t-container">
    <div class="t-py-8 t-px-4">
      <div v-if="!checkTrackingParam">
        {{ $t('Sorry, but we couldn\'t find a valid tracking-code in this tracking URL.') }}
      </div>
      <div
        id="pqt-tracking"
        :class="{ 't-bg-white t-p-4 md:t-p-8': sdKLoaded }"
      />
    </div>
  </div>
</template>

<script>
import config from 'config'
import { mapGetters } from 'vuex'

export default {
  name: 'OrderTracking',
  data () {
    return {
      sdKLoaded: false
    }
  },
  computed: {
    ...mapGetters({
      store: 'icmaaConfig/getCurrentStore'
    }),
    trackingCode () {
      return this.$route.query['tracking-code'] || false
    },
    checkTrackingParam () {
      /**
       * The original Paqato tracking-code has this format:
       * https://tracking.paqato.com/[LANGUAGE-CODE]~[PAQATO-CUSTOMER-ID]~[TRACKING-ID]~[ZIP-CODE]~[ORDER-ID]
       *
       * The tracking-code for the GET param of the Paqato script misses the `PAQATO-CUSTOMER-ID`,
       * because we set it on initial function call, so it results in:
       * https://domain.com/de/order-tracking?tracking-code=[LANGUAGE-CODE]~~[TRACKING-ID]~[ZIP-CODE]~[ORDER-ID]
       */
      return !!this.pqtCustomerId && !!this.trackingCode && this.trackingCode.split('~').length === 4
    },
    pqtCustomerId () {
      return config.icmaa_tracking?.paqato?.customerId || false
    }
  },
  methods: {
    loadSdkScript () {
      return new Promise(resolve => {
        const script = document.createElement('script')
        script.async = true
        script.src = '//tracking.paqato.com/scripts/pqt-tracking.min.js'
        script.onload = () => { resolve() }
        document.body.appendChild(script)
      })
    }
  },
  mounted () {
    if (!this.trackingCode || !this.checkTrackingParam) {
      this.$router.push(this.localizedHomeRoute)
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t('Sorry, but we couldn\'t find a valid tracking-code in this tracking URL.'),
        action1: { label: this.$t('OK') }
      })
    }

    this.loadSdkScript().then(() => {
      this.sdKLoaded = true

      // eslint-disable-next-line
      pqtTracking(this.pqtCustomerId, this.store.storeCode)
    })
  }
}
</script>

<style type="scss">
.pqt-trail,
.pqt-done {
  @apply t-z-0;
}
</style>
