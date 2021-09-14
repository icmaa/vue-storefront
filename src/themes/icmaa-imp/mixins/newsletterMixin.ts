import { mapGetters } from 'vuex'
import { price } from '@vue-storefront/core/filters/price'

export default {
  computed: {
    ...mapGetters({
      isSubscribedToNewsletter: 'newsletter/isSubscribed',
      storeConfig: 'icmaaConfig/getCurrentStoreConfig'
    }),
    newsletterVoucherValue () {
      const config = this.storeConfig
      if (config.newsletter.voucher_value) {
        return config.newsletter.voucher_value
      }
      return price(5)
    }
  }
}
