import { ActionTree } from 'vuex'
import * as types from './mutation-types'
import RootState from '@vue-storefront/core/types/RootState';
import BlockState from '../../types/BlockState'
import Axios from 'axios'
import config from 'config'
import { processURLAddress } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<BlockState, RootState> = {
  /**
   * @param context
   * @param {any} key
   * @param {any} value
   * @returns {Promise<T> & Promise<any>}
   */
  single (context, { value, key = 'identifier' }) {
    const state = context.state
    if (!state.items || state.items.length === 0 || !state.items.find(itm => itm[key] === value)) {
      return new Promise((resolve, reject) => {
        Axios.get(
          processURLAddress(config.icmaa_cms.endpoint),
          {
            responseType: 'json',
            params: {
              'type': 'cms-block',
              'uid': encodeURIComponent(value)
            }
          }
        ).then((resp) => {
          let result = resp.data.result;

          if (result.length === 0) {
            Logger.error('Empty cms response:', 'icmaa-cms', value)()
            return {}
          }

          result[key] = value;
          context.commit(types.ICMAA_CMS_BLOCK_ADD_CMS_BLOCK, result)

          return result
        }).catch(err => {
          Logger.error(`Error while fetching block "${value}"`, 'icmaa-cms', err)()
        })
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
