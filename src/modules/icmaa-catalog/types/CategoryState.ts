import CategoryState from '@vue-storefront/core/modules/catalog-next/store/category/CategoryState'

export default interface ExtendedCategoryState extends CategoryState {
  isGenericSubcategory: boolean
}
