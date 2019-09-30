import { mapGetters } from 'vuex'
import { htmlDecode } from '@vue-storefront/core/filters'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { getThumbnailPath } from '@vue-storefront/core/helpers'

const storeView = currentStoreView()
const currencyCode = storeView.i18n.currencyCode

export default {
  ...mapGetters({
    getOptionLabel: 'attribute/getOptionLabel'
  }),
  computed: {
    productName () {
      return this.product ? this.product.name : ''
    },
    productPrice () {
      return this.product ? this.product.price : ''
    },
    productBandOrBrand () {
      return this.product.brand ? this.product.brand : this.product.band
    },
    productBandOrBrandCode () {
      return this.product.brand ? 'brand' : 'band'
    },
    productFbImages () {
      if (!this.product.media_gallery) {
        return []
      }

      let facebookImageTags = []
      this.product.media_gallery.forEach(image => {
        facebookImageTags.push(
          {
            property: 'og:image',
            content: getThumbnailPath('/catalog/product' + image.image, this.width, this.height, 'media')
          }
        )
      })
      return facebookImageTags
    }
  },
  metaInfo () {
    return {
      title: 'Placeholder - productpage', // TODO
      meta: [
        { vmid: 'description', name: 'description', content: 'Placeholder - productpageDescrition' }, // TODO
        { vmid: 'og:title', property: 'og:title', content: htmlDecode(this.productName) },
        { vmid: 'og:type', property: 'og:type', content: 'product' },
        { name: 'product.final_price', content: this.productPrice },
        { name: 'product.price', content: this.productPrice },
        { name: 'product.name', content: htmlDecode(this.productName) },
        { name: 'product:condition', content: 'new' },
        { name: 'product:availability', content: this.product.stock.is_in_stock }, // TODO mapping values - available for order, in stock, out fo stock, preorder
        { name: 'product:price:currency', content: currencyCode },
        { name: 'product:price:amount', content: this.productPrice },
        { name: 'product:brand', content: this.getOptionLabel(this.productBandOrBrandCode, this.productBandOrBrand) },
        ...this.productFbImages
      ]
    }
  }
}
