import { storeCode, storeLang, store } from 'icmaa-meta/helper';
import { mapGetters } from 'vuex';
import { htmlDecode } from '@vue-storefront/core/filters'
import { currentStoreView, localizedRoute } from '@vue-storefront/core/lib/multistore'

const storeView = currentStoreView();

export default {

  computed: {
    ...mapGetters({
      product: 'product/productCurrent',
      originalProduct: 'product/productOriginal',
      parentProduct: 'product/productParent',
      attributesByCode: 'attribute/attributeListByCode',
      attributesById: 'attribute/attributeListById',
      breadcrumbs: 'product/breadcrumbs',
      configuration: 'product/currentConfiguration',
      options: 'product/currentOptions',
      category: 'category/getCurrentCategory',
      gallery: 'product/productGallery'
    }),
    productName () {
      return this.product ? this.product.name : ''
    },
    productPrice () {
      return this.product ? this.product.price : ''
    }
  },
  metaInfo () {
    return {
      title: 'Placeholder - productpage',
      meta: [
        { vmid: 'description', name: 'description', content: 'Placeholder - productpageDescrition' },
        { vmid: 'keywords', name: 'keywords', content: 'Placeholder - productpageKeywords' },
        { vmid: 'og:image', property: 'og:image', content: 'Placeholder - productpageImage(s)' }, // multiple ..
        { vmid: 'og:title', property: 'og:title', content: htmlDecode(this.productName) },
        { vmid: 'og:url', property: 'og:url', content: storeCode() },
        { vmid: 'og:type', property: 'og:type', content: 'product' },
        // { name: 'product.final_price', content: 'Placeholder - productpageFinalprice' }, // ??
        // { name: 'product.price', content: 'Placeholder - productpagePrice' }, // ??
        // { name: 'product.name', content: 'Placeholder - productpageName' }, // ??
        { name: 'product:condition', content: 'new' },
        { name: 'product:availability', content: 'test' },
        { name: 'product:price:currency', content: 'test' },
        { name: 'product:price:amount', content: htmlDecode(this.productPrice) },
        { name: 'product:brand', content: 'Placeholder - productpageBrand' }
      ]
    }
  }
};
