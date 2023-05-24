import { mapGetters } from 'vuex'
import config from 'config'
import i18n from '@vue-storefront/i18n'
import { price } from '@vue-storefront/core/filters/price'
import { Logo } from 'icmaa-category-extras/helpers/categoryExtras/logo'

export default {
  async asyncData ({ store, context }) {
    if (context) {
      context.output.cacheTags.add(`product`)
    }

    const product = store.getters['product/getCurrentProduct']
    const account = product.band || product.brand

    if (account) {
      await store.dispatch('category-next/loadCategoryWithExtras', { filters: { 'ceAccount': account } })
    }
  },
  mounted () {
    if (config.entities.attribute.loadByAttributeMetadata) {
      this.$store.dispatch('attribute/loadProductAttributes', { products: [ this.product ] })
    } else {
      this.$store.dispatch('product/loadProductAttributes', { product: this.product })
    }

    this.fetchSpotifyArtists()
  },
  watch: {
    '$route' (to, from) {
      this.fetchSpotifyArtists()
    }
  },
  computed: {
    ...mapGetters({
      getOptionLabel: 'attribute/getOptionLabel',
      categoryExtras: 'icmaaCategoryExtras/getCategoryExtrasByCurrentCategory',
      departmentCategory: 'icmaaCategoryExtras/getCurrentProductDepartmentCategory'
    }),
    departmentBrandType () {
      return this.product.brand ? 'brand' : 'band'
    },
    departmentBrandValue () {
      return this.product.brand || this.product.band
    },
    departmentBrandOptionLabel () {
      return this.getOptionLabel({
        attributeKey: this.departmentBrandValue,
        optionId: this.product[this.departmentBrandType]
      })
    },
    departmentLogo () {
      return (this.categoryExtras && this.categoryExtras.hasLogo) ? new Logo({ category: this.departmentCategory }) : false
    },
    hasDepartmentBrandOptionLabel () {
      return this.departmentBrandOptionLabel !== this.departmentBrandValue
    },
    productName () {
      let name = this.product.translatedName
      const regex = this.hasDepartmentBrandOptionLabel
        ? new RegExp('/^(' + this.departmentBrandOptionLabel + '*?)(\\s-\\s)/')
        : /^(.*?)(\s-\s)/

      return !regex.test(name) ? name : {
        mandant: name.match(regex)[1],
        product: name.replace(regex, '')
      }
    },
    formattedProductPrice () {
      return price(this.product.price_incl_tax)
    },
    webshareText () {
      const title = i18n.t(
        '{name} for {price}',
        { name: this.product.translatedName, price: this.formattedProductPrice }
      )
      return i18n.t('Checkout this out: {title}', { title })
    },
    reviewRating () {
      if (!this.product.id) return 0
      return parseInt(this.product?.reviews?.rating_summary || 0)
    },
    reviewCount () {
      if (!this.product.id) return 0
      return parseInt(this.product?.reviews?.count || 0)
    }
  },
  methods: {
    fetchSpotifyArtists () {
      const category = this.departmentCategory
      if (category) {
        this.$store.dispatch('icmaaSpotify/fetchRelatedArtists', category)
      }
    }
  }
}
