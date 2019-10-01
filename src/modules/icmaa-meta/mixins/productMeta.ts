import { mapGetters } from 'vuex'
import { htmlDecode } from '@vue-storefront/core/filters'
import { price } from '@vue-storefront/core/filters/price'
import { getThumbnailPath } from '@vue-storefront/core/helpers'

export default {
  computed: {
    ...mapGetters({
      getOptionLabel: 'attribute/getOptionLabel',
      storeConfig: 'icmaaConfig/getCurrentStoreConfig',
      store: 'icmaaConfig/getCurrentStore'
    }),
    currencyCode () {
      return this.storeConfig ? this.storeConfig.i18n.currencyCode : ''
    },
    productPrice () {
      return this.storeConfig ? price(this.product.price) : this.product.price
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
    /**
     * @todo Those two aren't working because the storeView state isn't available ?!?
     * @see https://vue-meta.nuxtjs.org/guide/caveats.html#reactive-variables-in-template-functions
     * @see https://github.com/nuxt/vue-meta/issues/322
     */
    const currencyCode = this.currencyCode
    const productPrice = this.productPrice

    return {
      title: this.translatedProductName,
      meta: [
        { vmid: 'description', name: 'description', content: htmlDecode(this.product.description) },
        { vmid: 'og:title', property: 'og:title', content: htmlDecode(this.translatedProductName) },
        { vmid: 'og:type', property: 'og:type', content: 'product' },
        { name: 'product.name', content: htmlDecode(this.translatedProductName) },
        { name: 'product.final_price', content: this.productPrice },
        { name: 'product.price', content: this.productPrice },
        { name: 'product:condition', content: 'new' },
        { name: 'product:availability', content: this.product.stock.is_in_stock }, // TODO mapping values - available for order, in stock, out fo stock, preorder
        { name: 'product:price:currency', content: currencyCode },
        { name: 'product:price:amount', content: productPrice },
        { name: 'product:brand', content: this.getOptionLabel({ attributeKey: this.productBandOrBrandCode, optionId: this.productBandOrBrand }) },
        ...this.productFbImages
      ]
    }
  }
}
