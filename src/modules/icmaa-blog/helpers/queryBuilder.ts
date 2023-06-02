import { SearchQuery } from 'storefront-query-builder'

export type QueryOptions = {
  identifier?: string,
  tags?: string,
  categories?: string | string[],
  accounts?: number,
  cluster?: number,
  clusterFashion?: number,
  resolveUrl?: boolean,
  firstPublishedAt?: Record<string, string>
}

const applyOptionalFilter = (query: SearchQuery, resolveUrl: boolean, key: string, value?: (string|number)|(string|number)[]|Record<string, string>) => {
  if (value) {
    if (resolveUrl) {
      query.applyFilter({ key, value: { or: value } })
    } else {
      query.applyFilter({ key, value })
    }
  }
}

export default ({ resolveUrl = false, identifier, tags, categories, accounts, cluster, clusterFashion, firstPublishedAt }: QueryOptions): SearchQuery => {
  const query = new SearchQuery()
  query
    .applyFilter({ key: 'active', value: true })
    .applyFilter({ key: 'activeDateRange', value: { toField: 'showTo', fromField: 'showFrom' } })

  applyOptionalFilter(query, resolveUrl, 'identifier', identifier)
  applyOptionalFilter(query, resolveUrl, 'categories', categories)

  if (!resolveUrl) {
    applyOptionalFilter(query, false, 'tags', tags)
    applyOptionalFilter(query, false, 'accounts', accounts)
    applyOptionalFilter(query, false, 'cluster', cluster)
    applyOptionalFilter(query, false, 'clusterFashion', clusterFashion)
    applyOptionalFilter(query, false, 'firstPublishedAt', firstPublishedAt)
  }

  query.applySort({ field: 'firstPublishedAt', options: 'desc' })

  return query
}
