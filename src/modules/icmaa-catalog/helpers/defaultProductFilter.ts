import { SearchQuery } from 'storefront-query-builder'

export default (query: SearchQuery, visibility: 'catalog'|'search'|'all' = 'catalog'): SearchQuery => {
  query
    .applyFilter({ key: 'stock', value: '' })
    .applyFilter({ key: 'activeDateRange', value: '' })
    .applyFilter({ key: 'status', value: { in: [0, 1] } })

  let visibilityFilter = [2, 4]
  if (visibility === 'search') visibilityFilter = [3, 4]
  if (visibility === 'all') visibilityFilter = [2, 3, 4]

  query.applyFilter({ key: 'visibility', value: { in: visibilityFilter } })

  return query
}
