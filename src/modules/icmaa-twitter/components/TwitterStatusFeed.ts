import { mapGetters } from 'vuex'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { IcmaaTwitterModule } from 'icmaa-twitter'
import { twitterify } from 'icmaa-twitter/helpers'

export default {
  props: {
    screenName: {
      type: String,
      required: true
    }
  },
  beforeCreate () {
    registerModule(IcmaaTwitterModule)
  },
  async mounted () {
    return this.$store.dispatch('icmaaTwitter/loadStatusFeed', this.screenName)
  },
  computed: {
    ...mapGetters({
      getStatus: 'icmaaTwitter/getStatusByScreenName'
    }),
    status () {
      return this.getStatus(this.screenName)
    }
  },
  methods: {
    twitterify (text) {
      return twitterify(text)
    }
  }
}
