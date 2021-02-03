import { ActionContext } from 'vuex'
import { SearchQuery } from 'storefront-query-builder'
import { MutationTypesInterface } from '../abstract/mutation-types'
import Task from '@vue-storefront/core/lib/sync/types/Task'
import CmsService from 'icmaa-cms/data-resolver/CmsService'
import searchByQuery, { SearchServiceResponse } from 'icmaa-cms/data-resolver/ElasticSearchService'

import pick from 'lodash-es/pick'
import omit from 'lodash-es/omit'
import isEmpty from 'lodash-es/isEmpty'

export { MutationTypesInterface }

export interface OptionsInterface {
  context: any,
  options: string | ListOptionsInterface | SingleOptionsInterface,
  documentType: string,
  mutationTypes: MutationTypesInterface,
  stateKey: string,
  identifier?: string,
  queue?: boolean
}

export interface SingleOptionsInterface {
  key?: string|null,
  value: string
}

export interface ListOptionsInterface {
  [key: string]: any,
  identifier?: string,
  sort?: string,
  size?: number,
  page?: number
}

export interface ElasticOptionsInterface<S, R> {
  context: ActionContext<S, R>,
  query: SearchQuery,
  entityType: string,
  mutationTypes: MutationTypesInterface,
  stateKey: string
}

const listSortOptionsParamKeys = [ 'sort', 'size', 'page' ]

const listMethod = async <T>(options: OptionsInterface): Promise<T[]|Task> => {
  let query = options.options as ListOptionsInterface | string
  let sortOptions = {}
  let { context, documentType, mutationTypes, stateKey, queue } = options
  const { state } = context

  const identifier = options.identifier || 'identifier'

  if (typeof query === 'string') {
    let valuesArray = query.split(',')
    const existingStateItems = valuesArray.filter(i => (state.items.find(s => s[identifier] === i)))

    if (state.items.length > 0 && valuesArray.length === existingStateItems.length) {
      return state.items.filter(i => existingStateItems.includes(i[identifier]))
    }

    query = valuesArray.filter(i => !existingStateItems.includes(i)).join(',')

    if (query.length === 0) {
      return
    }
  } else if (typeof query === 'object') {
    sortOptions = pick(query, listSortOptionsParamKeys)
    query = omit(query, listSortOptionsParamKeys)
  }

  if (queue) {
    const actionName = `store:${stateKey}/listSync`
    return CmsService.listQueue({ documentType, query, ...sortOptions, actionName })
      .then(results => results)
  } else {
    return CmsService.list<T>({ documentType, query, ...sortOptions })
      .then(results => {
        results.forEach(data => context.commit(mutationTypes.add, data))
        return results
      })
  }
}

export const list = async <T>(options: OptionsInterface): Promise<T[]> => {
  return listMethod<T>(options) as Promise<T[]>
}

export const listQueue = async <T>(options: OptionsInterface): Promise<Task> => {
  options.queue = true
  return listMethod<T>(options) as Promise<Task>
}

export const elasticList = async <T, S, R>(options: ElasticOptionsInterface<S, R>): Promise<SearchServiceResponse<T>> => {
  const { entityType, query, context, mutationTypes } = options
  const { commit } = context

  return searchByQuery<T>({ entityType, query })
    .then(resp => {
      commit(mutationTypes.add, resp.items)
      return resp
    })
}

export const single = async <T>(options: OptionsInterface): Promise<T> => {
  let { key, value } = options.options as SingleOptionsInterface
  let { context, documentType, mutationTypes } = options
  const { commit, state } = context

  if (!key || key === null) {
    key = 'identifier'
  }

  if (state.items && state.items.length > 0) {
    const existing = state.items.find(v => v[key] === value)
    if (existing) {
      return existing
    }
  }

  const promise = CmsService.single({ documentType, uid: value })
  return promise.then<T>((data: any): T => {
    if (!isEmpty(data)) {
      commit(mutationTypes.add, data)
    }
    return data
  })
}
