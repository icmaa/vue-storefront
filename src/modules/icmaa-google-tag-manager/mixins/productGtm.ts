import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import DefaultMixin from './defaultMixin'

export default {
  mixins: [ DefaultMixin ],
  computed: {
    gtmEventPayload () {
      if (!this.isGtmEnabled) {
        return false
      }

      const currentProduct = this.getGTMProductDTO(this.product)
      if (!currentProduct) {
        return false
      }

      const storeView = currentStoreView()
      const { currencyCode } = storeView.i18n

      return {
        event: 'icmaa-product-view',
        ecommerce: {
          currencyCode,
          detail: {
            products: [currentProduct]
          }
        }
      }
    }
  },
  watch: {
    product () {
      this.triggerGtmPageViewEvent()
    }
  }
}
