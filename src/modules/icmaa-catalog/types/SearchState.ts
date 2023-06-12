import { SearchClient as TSSearchClient } from 'typesense'
import { SearchOnlyCollection } from 'typesense/lib/Typesense/SearchOnlyCollection'
import { SearchResponse as TSSearchResponse } from 'typesense/lib/Typesense/Documents'

export type SearchClient = typeof TSSearchClient
export interface Collection<T = {}> extends SearchOnlyCollection<T> {}
export interface SearchResponse<T = {}> extends TSSearchResponse<T> {}

export default interface SearchState {
  currentTerm: string,
  client: SearchClient,
  collections: Record<string, Collection>
}
