import { SearchQuery } from 'storefront-query-builder'

interface QueryOptions {
  tags?: string,
  category?: string,
  size?: string
}

export default ({ tags, category, size }: QueryOptions): SearchQuery => {
  const query = new SearchQuery()
  query
    .applyFilter({ key: 'active', value: true })
    .applyFilter({ key: 'activeDateRange', value: { toField: 'showTo', fromField: 'showFrom' } })

  if (tags) {
    query.applyFilter({ key: 'tag', value: tags })
  }

  if (category) {
    query.applyFilter({ key: 'categories', value: category })
  }

  if (size) {
    query.applyFilter({ key: 'size', value: size })
  }

  query.applySort({ field: 'firstPublishedAt', options: 'desc' })

  return query
}
