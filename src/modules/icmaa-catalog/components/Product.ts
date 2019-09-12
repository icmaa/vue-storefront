import { mapGetters } from 'vuex'
import ProductNameHelper from '../helpers/productName'

export default {
  async asyncData ({ store }) {
    await store.dispatch('attribute/list', { filterValues: [ 'band', 'brand' ] })
    await store.dispatch('icmaaCmsCategoryExtras/loadDepartmentChildCategoryIdMap')
  },
  computed: {
    ...mapGetters('attribute', { getOptionLabel: 'getOptionLabel' }),
    ...mapGetters('icmaaCmsCategoryExtras', ['isDepartmentChildCategory']),
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
