import { storeCode } from 'icmaa-meta/helper';
import { htmlDecode } from '@vue-storefront/core/filters';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import config from 'config';

const storeView = currentStoreView()
const currencyCode = storeView.i18n.currencyCode

export default {
  computed: {
    productName () {
      return this.product ? this.product.name : ''
    },
    productPrice () {
      return this.product ? this.product.price : ''
    },
    productBrand () {
      return this.product.brand ? this.product.brand : this.product.band
    },
    productUrl () {
      return config.icmaa_meta.base_url + '/' + storeCode() + '/' + this.product.url_path; // TODO storecode "default"
    },
    productFbImages () {
      let facebookImageTags = []
      this.product.media_gallery.forEach(image => {
        facebookImageTags.push(
          { property: 'og:image', content: (config.icmaa_meta.base_url + '/media/catalog/product/') + image.image }
        )
      })
      // console.log(facebookImageTags);
      return facebookImageTags
    }
  },
  metaInfo () {
    return {
      title: 'Placeholder - productpage',
      meta: [
        { vmid: 'description', name: 'description', content: 'Placeholder - productpageDescrition' },
        { vmid: 'keywords', name: 'keywords', content: 'Placeholder - productpageKeywords' },
        { vmid: 'og:title', property: 'og:title', content: htmlDecode(this.productName) },
        { vmid: 'og:url', property: 'og:url', content: htmlDecode(this.productUrl) },
        { vmid: 'og:type', property: 'og:type', content: 'product' },
        { name: 'product.final_price', content: this.productPrice }, // ??
        { name: 'product.price', content: this.productPrice }, // ??
        { name: 'product.name', content: htmlDecode(this.productName) }, // ??
        { name: 'product:condition', content: 'new' },
        { name: 'product:availability', content: this.product.stock.is_in_stock }, // TODO mapping values - available for order, in stock, out fo stock, preorder
        { name: 'product:price:currency', content: currencyCode },
        { name: 'product:price:amount', content: this.productPrice },
        { name: 'product:brand', content: this.productBrand }, // TODO mapping values
        ...this.productFbImages
      ]
    }
  }
}
