import { SearchQuery } from 'storefront-query-builder'
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import { SearchResponse } from '@vue-storefront/core/types/search/SearchResponse'
import { quickSearchByQuery } from '@vue-storefront/core/lib/search'
import { entities } from 'config'
import { getObjectHash } from 'icmaa-config/helpers/hash'

interface FetchChildCategoriesOptions {
  parentId: number | number[],
  sort?: string,
  level?: number[] | number,
  onlyShowTargetLevelItems?: boolean,
  onlyActive?: boolean,
  includeFields?: any[],
  collectedCategories?: any[]
}

export const fetchCategoryById = ({ parentId }): Promise<SearchResponse> => {
  let searchQuery = new SearchQuery()
  searchQuery.applyFilter({ key: 'id', value: { 'eq': parentId } })

  return quickSearchByQuery({ entityType: 'category', query: searchQuery, size: 1, includeFields: entities.category.includeFields })
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
  searchQuery.applyFilter({ key: 'path', value: { 'eq': parentId } })

  if (onlyActive) {
    searchQuery.applyFilter({ key: 'is_active', value: { 'eq': true } })
  }

  if (!Array.isArray(level)) {
    level = [level]
  }

  if (onlyShowTargetLevelItems) {
    searchQuery.applyFilter({ key: 'level', value: level })
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

export const getFilterHash = (filter: Record<string, any>|boolean) => {
  return filter !== false ? getObjectHash(filter as Record<string, any>) : false
}
