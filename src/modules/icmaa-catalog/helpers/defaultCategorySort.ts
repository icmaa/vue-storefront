import { icmaa_catalog, products } from 'config'
import { Category } from 'core/modules/catalog-next/types/Category'

interface CustomSortByAttributesType { id: number|string, sort: string, label: string }

export const defaultCategorySort: { attribute: string, order: string } = products.defaultSortBy

/**
 * Get current categories custom default-sorting param if there is any.
 *
 * We could do this the clean way by importing the values of `available_sort_by` and `default_sort_by` of the ES.
 * But as we need this feature for only 3 categories yet we do it using a configuration array.
 * This way we save space in our category payload and state which we would only use in 3 categories.
 *
 * @param {Category} category
 * @return {Record<string, string> | boolean}
 */
export const getCustomCategorySort = (category: Category): Record<string, string> | boolean => {
  const customSortAttr: CustomSortByAttributesType[] = icmaa_catalog.entities.category.customSortByAttributes
  const customCategory = customSortAttr.find(c => [category.id, category.parent_id].includes(c.id))
  if (customCategory) {
    return { [customCategory.label]: customCategory.sort || 'reset' }
  }

  return false
}

/**
 * @param {Category} category
 * @return {Record<string, string>|boolean}
 */
export const getCategorySort = (category: Category): string => {
  const sort = getCustomCategorySort(category)
  return sort ? Object.values(sort)[0] : `${defaultCategorySort.attribute}:${defaultCategorySort.order}}`
}

export default getCategorySort
