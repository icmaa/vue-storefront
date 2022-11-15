import { mapGetters } from 'vuex'
import { htmlDecode } from '@vue-storefront/core/filters'
import { getThumbnailPath } from '@vue-storefront/core/helpers'

export default {
  computed: {
    ...mapGetters({
      getOptionLabel: 'attribute/getOptionLabel',
      storeConfig: 'icmaaConfig/getCurrentStoreConfig'
    }),
    currencyCode () {
      return this.storeConfig ? this.storeConfig.i18n.currencyCode : ''
    },
    translatedName () {
      return this.product.translatedName
    },
    productPrice () {
      return this.product.original_price_incl_tax || this.productFinalPrice
    },
    productFinalPrice () {
      return this.product.price_incl_tax
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
      title: this.translatedName,
      meta: [
        { vmid: 'description', name: 'description', content: htmlDecode(this.product.meta_description || this.product.description) },
        { vmid: 'og:title', property: 'og:title', content: htmlDecode(this.translatedName) },
        { vmid: 'og:type', property: 'og:type', content: 'product' },
        { name: 'product.name', content: htmlDecode(this.translatedName) },
        { name: 'product.final_price', content: this.productFinalPrice },
        { name: 'product.price', content: this.productPrice },
        { name: 'product:condition', content: 'new' },
        { name: 'product:availability', content: this.product.stock ? this.product.stock.is_in_stock : false },
        { name: 'product:price:currency', content: this.storeConfig.i18n.currencyCode },
        { name: 'product:price:amount', content: this.productFinalPrice },
        { name: 'product:brand', content: this.getOptionLabel({ attributeKey: this.productBandOrBrandCode, optionId: this.productBandOrBrand }) },
        ...this.productFbImages
      ]
    }
  }
}
