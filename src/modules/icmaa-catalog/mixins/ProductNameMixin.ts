import { Logger } from '@vue-storefront/core/lib/logger'
import ProductNameHelper from '../helpers/productName'

export default {
  computed: {
    translatedProductName () {
      try {
        return new ProductNameHelper(this.product.name || '').translatedName
      } catch (err) {
        Logger.error('Error during product-name translation: ', 'icmaa-catalog', { error: err.message, product: this.product })()
        return this.product.name
      }
    }
  }
}
