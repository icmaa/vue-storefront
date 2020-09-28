import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import mapKeys from 'lodash-es/mapKeys'
import pick from 'lodash-es/pick'

export const getCategoryExtrasKeyByAttribute = (type: string): string => {
  return 'ce' + (type as string).charAt(0).toUpperCase() + (type as string).slice(1)
}

export const mapCategoryExtrasAttributes = (category: Category) => {
  const ceKeys = Object.keys(category).filter(k => /^ce[A-Z]/.test(k))
  category = pick(category, ceKeys)
  return mapKeys(category, (v, key) => key.charAt(2).toLowerCase() + key.slice(3))
}
