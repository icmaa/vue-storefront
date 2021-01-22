import config from 'config'
import pick from 'lodash-es/pick'
import { stringify } from 'query-string'

import { getCurrentStoreCode } from '../helpers'
import IcmaaTaskQueue from './Task'

import { processURLAddress } from '@vue-storefront/core/helpers'
import Task from '@vue-storefront/core/lib/sync/types/Task'

interface QueryOptions { documentType: string, storeCode?: string, [key: string]: any }

const getSortOptionsFromOptions = (options: any): { sort?: string, size?: number, page?: number } => {
  return pick(options, ['sort', 'size', 'page'])
}

const createQueryString = (query: Record<string, any>, options: QueryOptions): string => {
  const release = config.icmaa_cms.release ? { release: config.icmaa_cms.release } : {}
  const defaults = {
    'lang': options.storeCode || getCurrentStoreCode(),
    'type': options.documentType
  }
  return stringify(Object.assign(defaults, release, query))
}

const single = <T>(options: { documentType: string, uid: string, storeCode?: string }): Promise<T | boolean> => {
  const queryString = createQueryString({ 'uid': options.uid }, options)
  return IcmaaTaskQueue.execute({
    url: processURLAddress(config.icmaa_cms.endpoint) + `/by-uid?${queryString}`,
    is_result_cacheable: true,
    silent: true
  }).then(resp => resp.resultCode === 200 ? resp.result : false)
}

const singleQueue = (options: { documentType: string, uid: string, storeCode?: string, actionName?: string }): Promise<Task|any> => {
  const queryString = createQueryString({ 'uid': options.uid }, options)
  return IcmaaTaskQueue.queue({
    url: processURLAddress(config.icmaa_cms.endpoint) + `/by-uid?${queryString}`,
    is_result_cacheable: true,
    silent: true,
    callback_event: options.actionName ? options.actionName : undefined
  })
}

const list = <T>(options: { documentType: string, query: Record<string, any> | string, sort?: string, size?: number, page?: number, storeCode?: string }): Promise<T[]> => {
  const queryString = createQueryString({
    'q': typeof options.query === 'object' ? JSON.stringify(options.query) : options.query,
    ...getSortOptionsFromOptions(options)
  }, options)

  return IcmaaTaskQueue.execute({
    url: processURLAddress(config.icmaa_cms.endpoint) + `/search?${queryString}`,
    is_result_cacheable: true,
    silent: true
  }).then(resp => resp.resultCode === 200 ? resp.result : false)
}

const listQueue = (options: { documentType: string, query: Record<string, any> | string, sort?: string, size?: number, page?: number, storeCode?: string, actionName?: string }): Promise<Task|any> => {
  const queryString = createQueryString({
    'q': typeof options.query === 'object' ? JSON.stringify(options.query) : options.query,
    ...getSortOptionsFromOptions(options)
  }, options)

  return IcmaaTaskQueue.queue({
    url: processURLAddress(config.icmaa_cms.endpoint) + `/search?${queryString}`,
    is_result_cacheable: true,
    silent: true,
    callback_event: options.actionName ? options.actionName : undefined
  })
}

const datasource = <T>(options: { code: string }): Promise<T | boolean> => {
  return IcmaaTaskQueue.execute({
    url: processURLAddress(config.icmaa_cms.endpoint) + `/datasource/${options.code}`,
    is_result_cacheable: true,
    silent: true
  }).then(resp => resp.resultCode === 200 ? resp.result : false)
}

export default {
  single,
  singleQueue,
  list,
  listQueue,
  datasource
}
