import Vue from 'vue'
import { ActionTree } from 'vuex'
import { KEY } from '../../'
import * as types from './mutation-types'
import RootState from '@vue-storefront/core/types/RootState';
import BlockState from '../../types/BlockState'
import { cmsBlockStorageKey } from './'

import Axios from 'axios'
import config from 'config'

import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { processURLAddress } from '@vue-storefront/core/helpers'
import { isServer } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<BlockState, RootState> = {
  async single (context, { value, key = 'identifier' }): Promise<any> {
    const state = context.state
    const cache = Vue.prototype.$db[KEY]
    const storeView = currentStoreView()

    if (!state.items || state.items.length === 0 || !state.items.find(itm => itm[key] === value)) {
      const cacheKey = cmsBlockStorageKey + '/' + value
      if (await cache.getItem(cacheKey).then(item => item !== null)) {
        return cache.getItem(cacheKey).then(result => {
          context.commit(types.ICMAA_CMS_BLOCK_UPD, result)
          return result
        })
      }

      if (!isServer) {
        context.commit(types.ICMAA_CMS_BLOCK_ADD, { identifier: value })
      }

      let params = {
        'type': 'cms-block',
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
        if (result.length === 0) {
          Logger.error('Empty cms response:', 'icmaa-cms', value)()
          return {}
        }

        result[key] = value;
        context.commit(types.ICMAA_CMS_BLOCK_UPD, result)

        cache.setItem(cacheKey, result)
          .catch(error => Logger.error(error, 'icmaa-cms'))

        return result
      }).catch(err => {
        context.commit(types.ICMAA_CMS_BLOCK_RMV, { identifier: value })
        Logger.error(`Error while fetching block "${value}"`, 'icmaa-cms', err)()
      })
    } else {
      return new Promise((resolve, reject) => {
        if (state.items.length > 0) {
          let block = state.items.find(itm => itm[key] === value)
          if (block) {
            resolve(block)
          } else {
            reject(new Error('CMS block query returned empty result ' + key + ' = ' + value))
          }
        } else {
          resolve()
        }
      })
    }
  }
}

export default actions
