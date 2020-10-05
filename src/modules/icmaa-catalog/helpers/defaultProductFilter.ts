import { SearchQuery } from 'storefront-query-builder'

export default (query: SearchQuery, addVisibilityFilter = false): SearchQuery => {
  query
    .applyFilter({ key: 'stock', value: '' })
    .applyFilter({ key: 'activeDateRange', value: '' })

  if (addVisibilityFilter) {
    query
      .applyFilter({ key: 'visibility', value: { in: [2, 3, 4] } })
      .applyFilter({ key: 'status', value: { in: [0, 1] } })
  }

  return query
}
