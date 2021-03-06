import { SearchQuery } from 'storefront-query-builder'
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import { quickSearchByQuery } from '@vue-storefront/core/lib/search'
import { entities } from 'config'

interface FetchChildCategoriesOptions {
  parentId: number | number[],
  sort?: string,
  level?: number[] | number,
  onlyShowTargetLevelItems?: boolean,
  onlyActive?: boolean,
  includeFields?: any[],
  collectedCategories?: any[]
}

export const fetchChildCategories = async (
  {
    parentId,
    sort = 'position:asc',
    level = 1,
    onlyShowTargetLevelItems = true,
    onlyActive = false,
    includeFields = entities.category.includeFields
  }: FetchChildCategoriesOptions
): Promise<Category[]> => {
  let searchQuery = new SearchQuery()
  searchQuery.applyFilter({ key: 'path', value: parentId })

  if (onlyActive) {
    searchQuery.applyFilter({ key: 'is_active', value: true })
  }

  if (!Array.isArray(level)) {
    level = [level]
  }

  if (onlyShowTargetLevelItems) {
    searchQuery.applyFilter({ key: 'level', value: { in: level } })
  }

  return quickSearchByQuery({ entityType: 'category', query: searchQuery, sort, includeFields, size: 5000 })
    .then(resp => resp.items)
}

const SORT_PREFIX_REGEXP = /^()\s/gmi // Is not intended yet but could be smth. like: /^(the|der|die|das)\s/gmi
const SORT_REPLACE_REGEXP = /[^0-9a-zA-Z]/gm
export const extractPrefix = (name) => name.replace(SORT_PREFIX_REGEXP, '')
export const filterAlphanum = (name) => name
  .replace(/[äÄ]/gmi, 'ae')
  .replace(/[öÖ]/gmi, 'oe')
  .replace(/[üÜ]/gmi, 'ue')
  .replace(SORT_REPLACE_REGEXP, ' ')
  .toLowerCase()

export const sortByLetter = (a: Category, b: Category) => {
  const [aName, bName] = [extractPrefix(a.name), extractPrefix(b.name)]
  return aName === bName ? 0 : filterAlphanum(aName) < filterAlphanum(bName) ? -1 : 1
}
