import { SearchQuery } from 'storefront-query-builder'

export type QueryOptions = {
  identifier?: string,
  tags?: string,
  category?: string,
  size?: string,
  resolveUrl?: boolean
}

const applyOptionalFilter = (query: SearchQuery, resolveUrl: boolean, key: string, value?: string) => {
  if (value) {
    if (resolveUrl) {
      query.applyFilter({ key, value: { or: value } })
    } else {
      query.applyFilter({ key, value })
    }
  }
}

export default ({ resolveUrl = false, identifier, tags, category, size }: QueryOptions): SearchQuery => {
  const query = new SearchQuery()
  query
    .applyFilter({ key: 'active', value: true })
    .applyFilter({ key: 'activeDateRange', value: { toField: 'showTo', fromField: 'showFrom' } })

  applyOptionalFilter(query, resolveUrl, 'identifier', identifier)
  applyOptionalFilter(query, resolveUrl, 'tag', tags)
  applyOptionalFilter(query, resolveUrl, 'categories', category)
  applyOptionalFilter(query, resolveUrl, 'size', size)

  query.applySort({ field: 'firstPublishedAt', options: 'desc' })

  return query
}
