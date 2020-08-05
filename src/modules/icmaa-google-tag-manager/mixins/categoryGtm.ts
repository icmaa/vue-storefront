import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { googleTagManager } from 'config'
import DefaultMixin from './defaultMixin'

export default {
  mixins: [ DefaultMixin ],
  computed: {
    ...mapGetters({
      categoryProducts: 'category-next/getCategoryProducts'
    }),
    products () {
      return this.categoryProducts
        .slice(0, googleTagManager.categoryProductCount)
        .map(p => this.getGTMProductDTO(p, googleTagManager.categoryProductAttributes))
    },
    gtmEventPayload () {
      if (!this.isGtmEnabled || this.products.length === 0) {
        return false
      }

      const storeView = currentStoreView()
      const { currencyCode } = storeView.i18n

      return {
        event: 'icmaa-category-view',
        ecommerce: {
          currencyCode,
          categoryId: this.getCurrentCategory.id,
          categoryName: this.getCurrentCategory.name,
          impressions: this.products
        }
      }
    }
  },
  watch: {
    categoryProducts () {
      // this.triggerGtmPageViewEvent()
    }
  }
}
