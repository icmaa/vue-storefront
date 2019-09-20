import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'
import { price } from '@vue-storefront/core/filters/price'
import ProductNameHelper from '../helpers/productName'
import { Logo } from 'icmaa-cms/helpers/categoryExtras/logo'

export default {
  async asyncData ({ store }) {
    await store.dispatch('attribute/list', { filterValues: [ 'band', 'brand' ] })
    await store.dispatch('icmaaCmsCategoryExtras/loadDepartmentChildCategoryIdMap')

    const departmentCategoryId = store.getters['icmaaCmsCategoryExtras/getCurrentProductDepartmentCategoryId']
    if (departmentCategoryId) {
      await store.dispatch('category-next/loadCategory', { filters: { 'id': departmentCategoryId } })

      const category = store.getters['icmaaCmsCategoryExtras/getCurrentProductDepartmentCategory']
      if (category) {
        await store.dispatch('icmaaCmsCategoryExtras/single', { value: category.url_key })
      }
    }
  },
  computed: {
    ...mapGetters('attribute', { getOptionLabel: 'getOptionLabel' }),
    ...mapGetters('icmaaCmsCategoryExtras', ['getCurrentProductDepartmentCategory', 'getCategoryExtrasByUrlKey']),
    ...mapGetters({ reviews: 'review/getReviews', reviewsCount: 'review/getReviewsCount', reviewsTotalRating: 'review/getReviewsTotalRating' }),
    departmentCategory () {
      return this.getCurrentProductDepartmentCategory
    },
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
      return (this.categoryExtras && this.categoryExtras.hasLogo) ? new Logo(this.departmentCategory) : false
    },
    hasDepartmentBrandOptionLabel () {
      return this.departmentBrandOptionLabel !== this.departmentBrandValue
    },
    categoryExtras () {
      if (this.departmentCategory) {
        return this.getCategoryExtrasByUrlKey(this.departmentCategory.url_key)
      }
    },
    translatedProductName () {
      return new ProductNameHelper(this.product.name).translatedName
    },
    productName () {
      let name = this.translatedProductName
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
      return i18n.t(
        'Checkout this out: {name} for {price}',
        { name: this.translatedProductName, price: this.formattedProductPrice }
      )
    }
  }
}
