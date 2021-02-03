import { quickSearchByQuery } from '@vue-storefront/core/lib/search'
import { SearchQuery } from 'storefront-query-builder'

export interface SearchServiceParams {
  entityType: string,
  query: SearchQuery,
  size?: number,
  start?: number,
  sort?: string,
  includeFields?: string[],
  excludeFields?: string[]
}

export interface SearchServiceResponse<T> {
  items: T[],
  perPage?: number,
  start?: number,
  total?: number,
  aggregations?: any[],
  attributeMetadata?: any[]
}

const searchByQuery = async <T>({ entityType, query, start = 0, size = 100, sort = '', excludeFields = null, includeFields = null }: SearchServiceParams): Promise<SearchServiceResponse<T>> => {
  let {
    items = [],
    attributeMetadata = [],
    aggregations = [],
    total,
    perPage
  } = await quickSearchByQuery({
    query,
    start,
    size,
    entityType,
    sort,
    excludeFields,
    includeFields
  })

  return {
    items,
    perPage,
    start,
    total,
    aggregations,
    attributeMetadata
  } as any
}

export default searchByQuery
