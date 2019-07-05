import Vue from 'vue'

import { KEY } from '../../'

import Axios from 'axios'
import config from 'config'

import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { processURLAddress } from '@vue-storefront/core/helpers'
import { isServer } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'

export interface OptionsInterface {
  context: any,
  options: SingleOptionsInterface,
  documentType: string,
  mutationTypes: MutationTypesInterface,
  storageKey: string
}

export interface SingleOptionsInterface {
  key?: string|null,
  value: string
}

export interface MutationTypesInterface {
  add: string,
  upd: string,
  rmv: string
}

export const single = async (options: OptionsInterface) => {
  let { key, value } = options.options
  let { context, documentType, mutationTypes, storageKey } = options
  if (!key || key === null) {
    key = 'identifier'
  }

  const state = context.state
  const cache = Vue.prototype.$db[KEY]
  const storeView = currentStoreView()

  if (!state.items || state.items.length === 0 || !state.items.find(itm => itm[key] === value)) {
    const cacheKey = storageKey + '/' + value
    if (await cache.getItem(cacheKey).then(item => item !== null)) {
      return cache.getItem(cacheKey).then(result => {
        context.commit(mutationTypes.add, result)
        return result
      })
    }

    if (!isServer) {
      context.commit(mutationTypes.add, { identifier: value })
    }

    let params = {
      'type': documentType,
      'uid': encodeURIComponent(value),
      'lang': null
    }

    if (storeView) {
      params.lang = storeView.i18n.defaultLocale.toLowerCase()
    }

    return Axios.get(
      processURLAddress(config.icmaa_cms.endpoint),
      { responseType: 'json', params }
    ).then(resp => {
      let result = resp.data.result;
      if (Object.keys(result).length === 0 || resp.status !== 200) {
        throw new Error(resp.statusText)
      }

      result[key] = value;
      context.commit(mutationTypes.upd, result)

      cache.setItem(cacheKey, result)
        .catch(error => Logger.error(error, 'icmaa-cms'))

      return result
    }).catch(err => {
      context.commit(mutationTypes.rmv, { identifier: value })
      Logger.error(`Error while fetching identifier "${value}"`, 'icmaa-cms', err)()
    })
  } else {
    return new Promise((resolve, reject) => {
      if (state.items.length > 0) {
        let block = state.items.find(itm => itm[key] === value)
        if (block) {
          resolve(block)
        } else {
          reject(new Error('Error while fetching state for ' + key + ' = ' + value))
        }
      } else {
        resolve()
      }
    })
  }
}
