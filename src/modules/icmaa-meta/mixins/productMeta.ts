import { storeCode, storeLang, store, storeCurrency } from 'icmaa-meta/helper';
import { mapGetters } from 'vuex';
import { htmlDecode } from '@vue-storefront/core/filters';

export default {
  computed: {
    ...mapGetters({
      product: 'product/productCurrent'
    }),
    productName () {
      return this.product ? this.product.name : ''
    },
    productPrice () {
      return this.product ? this.product.price : ''
    },
    productBrandBand () {
      return this.product ? this.product.brand : this.product.band
    }
  },
  metaInfo () {
    return {
      title: 'Placeholder - productpage',
      meta: [
        { vmid: 'description', name: 'description', content: 'Placeholder - productpageDescrition' },
        { vmid: 'keywords', name: 'keywords', content: 'Placeholder - productpageKeywords' },
        { vmid: 'og:image', property: 'og:image', content: htmlDecode(this.product.image) }, // TODO multiple images..
        { vmid: 'og:title', property: 'og:title', content: htmlDecode(this.productName) },
        { vmid: 'og:url', property: 'og:url', content: htmlDecode(this.product.url_path) },
        { vmid: 'og:type', property: 'og:type', content: 'product' },
        { name: 'product.final_price', content: this.productPrice }, // ??
        { name: 'product.price', content: this.productPrice }, // ??
        { name: 'product.name', content: htmlDecode(this.productName) }, // ??
        { name: 'product:condition', content: 'new' },
        { name: 'product:availability', content: this.product.stock.is_in_stock }, // TODO available for order, in stock, out fo stock, preorder
        { name: 'product:price:currency', content: storeCurrency() },
        { name: 'product:price:amount', content: this.productPrice },
        { name: 'product:brand', content: this.productBrandBand } // TODO mapping values
      ]
    }
  }
}
