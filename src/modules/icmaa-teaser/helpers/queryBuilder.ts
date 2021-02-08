import config from 'config'
import { SearchQuery } from 'storefront-query-builder'

interface TeaserQueryOptions {
  tags: string,
  size?: string,
  cluster?: string,
  gender?: string
}

export default ({ tags, size, cluster, gender }: TeaserQueryOptions): SearchQuery => {
  const query = new SearchQuery()
  query
    .applyFilter({ key: 'active', value: true })
    .applyFilter({ key: 'activeDateRange', value: { toField: 'showTo', fromField: 'showFrom' } })
    .applyFilter({ key: 'tag', value: tags })

  if (size) {
    query.applyFilter({ key: 'size', value: size })
  }

  const clusterValue = cluster || config.icmaa.user.noClusterValue
  query.applyFilter({ key: 'cluster', value: { orNull: [ clusterValue ] } })

  const genderValues = gender ? [ '', gender ] : [ '' ]
  query.applyFilter({ key: 'gender', value: { orNull: genderValues } })

  query.applySort({ field: 'order', options: 'desc' })

  return query
}
