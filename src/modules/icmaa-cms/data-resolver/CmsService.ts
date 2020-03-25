import config from 'config'

import { getCurrentStoreCode } from '../helpers'
import IcmaaTaskQueue from '../data-resolver/Task'

import { processURLAddress } from '@vue-storefront/core/helpers'
import Task from '@vue-storefront/core/lib/sync/types/Task'

const single = <T>(options: { documentType: string, uid: string, storeCode?: string }): Promise<T | boolean> => {
  const queryString = IcmaaTaskQueue.createQueryString({
    'type': options.documentType,
    'uid': options.uid,
    'lang': options.storeCode || getCurrentStoreCode()
  })

  return IcmaaTaskQueue.execute({
    url: processURLAddress(config.icmaa_cms.endpoint) + `/by-uid?${queryString}`,
    payload: {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    },
    is_result_cacheable: true,
    silent: true
  }).then(resp => resp.resultCode === 200 ? resp.result : false)
}

const singleQueue = (options: { documentType: string, uid: string, storeCode?: string, actionName?: string }): Promise<Task|any> => {
  const queryString = IcmaaTaskQueue.createQueryString({
    'type': options.documentType,
    'uid': options.uid,
    'lang': options.storeCode || getCurrentStoreCode()
  })

  return IcmaaTaskQueue.queue({
    url: processURLAddress(config.icmaa_cms.endpoint) + `/by-uid?${queryString}`,
    payload: {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    },
    is_result_cacheable: true,
    silent: true,
    callback_event: options.actionName ? options.actionName : undefined
  })
}

const list = <T>(options: { documentType: string, query: Record<string, any>, storeCode?: string }): Promise<T[]> => {
  const queryString = IcmaaTaskQueue.createQueryString({
    'type': options.documentType,
    'q': typeof options.query === 'object' ? JSON.stringify(options.query) : options.query,
    'lang': options.storeCode || getCurrentStoreCode()
  })

  return IcmaaTaskQueue.execute({
    url: processURLAddress(config.icmaa_cms.endpoint) + `/search?${queryString}`,
    payload: {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    },
    is_result_cacheable: true,
    silent: true
  }).then(resp => resp.resultCode === 200 ? resp.result : false)
}

const listQueue = (options: { documentType: string, query: Record<string, any>, storeCode?: string, actionName?: string }): Promise<Task|any> => {
  const queryString = IcmaaTaskQueue.createQueryString({
    'type': options.documentType,
    'q': typeof options.query === 'object' ? JSON.stringify(options.query) : options.query,
    'lang': options.storeCode || getCurrentStoreCode()
  })

  return IcmaaTaskQueue.queue({
    url: processURLAddress(config.icmaa_cms.endpoint) + `/search?${queryString}`,
    payload: {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    },
    is_result_cacheable: true,
    silent: true,
    callback_event: options.actionName ? options.actionName : undefined
  })
}

const datasource = <T>(options: { code: string }): Promise<T | boolean> => {
  return IcmaaTaskQueue.execute({
    url: processURLAddress(config.icmaa_cms.endpoint) + `/datasource/${options.code}`,
    payload: {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    },
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