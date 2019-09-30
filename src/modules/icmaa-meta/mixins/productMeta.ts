import { htmlDecode } from '@vue-storefront/core/filters'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { optionLabel } from '@vue-storefront/core/modules/catalog/helpers/optionLabel'
import { getThumbnailPath } from '@vue-storefront/core/helpers'

const storeView = currentStoreView()
const currencyCode = storeView.i18n.currencyCode

export default {
  async asyncData ({ store }) {
    /**
     * Load the attribute options and labels we need for metaInfo()
     * !!! It's important to know that attributes are removed from initial ssr state by default and put into
     * localstorage on client-side using the "useInitialStateFilter" config to save some DOM output size (up to 50%).
     * But this way we can't load the attribute values because they are already empty in state management when we try
     * to load them in metaInfo(). So we removed "attributes" from "initialStateFilter" config value.
     * @see https://github.com/DivanteLtd/vue-storefront/issues/3520#issuecomment-530336629
     */
    return store.dispatch('attribute/list', { filterValues: [ 'band', 'brand' ] })
  },
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
  methods: {
    getAttributeLabel (attributeKey: string = '', optionId: number) {
      return optionLabel(this.$store.state.attribute, { attributeKey, optionId })
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
        { name: 'product:brand', content: this.getAttributeLabel(this.productBandOrBrandCode, this.productBandOrBrand) },
        ...this.productFbImages
      ]
    }
  }
}
