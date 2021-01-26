import { SearchQuery } from 'storefront-query-builder'
import { TeaserStateItem } from '../types/TeaserState'
import searchByQuery, { SearchServiceResponse } from 'icmaa-cms/data-resolver/CmsEsService'

interface TeaserQueryOptions {
  tags: string,
  size?: string,
  cluster?: string,
  gender?: string
}

interface TeaserResponse extends SearchServiceResponse {
  items: TeaserStateItem[]
}

export const createSearchQuery = ({ tags, size, cluster, gender }: TeaserQueryOptions): SearchQuery => {
  const query = new SearchQuery()
  query
    .applyFilter({ key: 'active', value: true })
    .applyFilter({ key: 'activeDateRange', value: { toField: 'showTo', fromField: 'showFrom' } })
    .applyFilter({ key: 'tag', value: tags })

  if (size) {
    query.applyFilter({ key: 'size', value: size })
  }

  const clusterValue = cluster ? { orNull: [ cluster ] } : null
  query.applyFilter({ key: 'cluster', value: clusterValue })

  const genderValues = gender ? [ '', gender ] : [ '' ]
  query.applyFilter({ key: 'gender', value: { orNull: genderValues } })

  query.applySort({ field: 'order', options: 'desc' })

  return query
}

export default (options: TeaserQueryOptions) => {
  const query = createSearchQuery(options)
  return searchByQuery<TeaserResponse>({ query })
}
