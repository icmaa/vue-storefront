import { CategoryStateCategory } from '../types/CategoryState'
import SearchQuery from '@vue-storefront/core/lib/search/searchQuery'
import { SearchResponse } from '@vue-storefront/core/types/search/SearchResponse';
import { quickSearchByQuery } from '@vue-storefront/core/lib/search'

export const fetchCategoryById = ({ parentId }): Promise<SearchResponse> => {
  let searchQuery = new SearchQuery()
  searchQuery.applyFilter({ key: 'id', value: { 'eq': parentId } })

  return quickSearchByQuery({ entityType: 'category', query: searchQuery, size: 1 })
}

export const fetchChildCategories = async ({ parentId, level = 1, collectedCategories = [] }): Promise<CategoryStateCategory[]> => {
  let searchQuery = new SearchQuery()
  searchQuery.applyFilter({ key: 'parent_id', value: { 'eq': parentId } })

  return quickSearchByQuery({ entityType: 'category', query: searchQuery, size: 1000 })
    .then(resp => {
      if (resp.items.length > 0 && resp.items[0].level <= level) {
        let childIds = []
        resp.items.forEach(item => {
          if (item.children_count > 0) {
            childIds.push(item.id)
          }

          collectedCategories.push(item)
        })

        if (childIds.length > 0) {
          return fetchChildCategories({ parentId: childIds, level, collectedCategories })
        }
      }

      return collectedCategories
    })
}
