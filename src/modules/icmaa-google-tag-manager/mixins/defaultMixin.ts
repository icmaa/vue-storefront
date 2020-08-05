import { mapGetters } from 'vuex'
import { IcmaaGoogleTagManagerExecutors as Executor } from '../hooks'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export const mixinFactory = (eventName: string = 'icmaa-page-view') => ({
  computed: {
    ...mapGetters({
      isGtmEnabled: 'icmaaGoogleTagManager/enabled',
      getGTMProductDTO: 'icmaaGoogleTagManager/getGTMProductDTO'
    }),
    defaultGtmEventPayload () {
      const { storeCode } = currentStoreView()

      return {
        'event': eventName,
        'content-name': this.$route.fullPath,
        'content-view-name': this.$route.meta.gtm || this.$route.name,
        'store_code': storeCode,
        'customerLoggedIn': this.$store.getters['user/isLoggedIn'],
        'customerEmail': this.$store.getters['user/getUserEmail']
      }
    },
    gtmEventPayload () {
      return {}
    }
  },
  methods: {
    triggerGtmPageViewEvent () {
      if (!this.isGtmEnabled) {
        return
      }

      const event = Object.assign(this.defaultGtmEventPayload, this.gtmEventPayload)
      Executor.onGtmPageView({ type: event.event || eventName, event })
    }
  },
  mounted () {
    this.triggerGtmPageViewEvent()
  }
})

export default mixinFactory()
