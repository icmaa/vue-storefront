import { mapGetters } from 'vuex'
import ProductNameHelper from '../helpers/productName'
import { Logger } from '@vue-storefront/core/lib/logger'

export default {
  async asyncData ({ store }) {
    await store.dispatch('attribute/list', { filterValues: [ 'band', 'brand' ] })
    await store.dispatch('icmaaCmsCategoryExtras/loadDepartmentChildCategoryIdMap')

    const departmentCategoryId = store.getters['icmaaCmsCategoryExtras/getCurrentProductDepartmentCategoryId']
    if (departmentCategoryId) {
      await store.dispatch('category-next/loadCategory', { filters: { 'id': departmentCategoryId } })

      const category = store.getters['icmaaCmsCategoryExtras/getCurrentProductDepartmentCategory']
      await store.dispatch('icmaaCmsCategoryExtras/single', { value: category.url_key })
    }
  },
  computed: {
    ...mapGetters('attribute', { getOptionLabel: 'getOptionLabel' }),
    ...mapGetters('icmaaCmsCategoryExtras', ['getCurrentProductDepartmentCategory']),
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
    hasDepartmentBrandOptionLabel () {
      return this.departmentBrandOptionLabel !== this.departmentBrandValue
    },
    productName () {
      let name = this.product.name
      const regex = this.hasDepartmentBrandOptionLabel
        ? new RegExp('/^(' + this.departmentBrandOptionLabel + '*?)(\\s-\\s)/')
        : /^(.*?)(\s-\s)/

      return !regex.test(name) ? name : {
        mandant: name.match(regex)[1],
        product: new ProductNameHelper(name).translatedName.replace(regex, '')
      }
    }
  }
}
