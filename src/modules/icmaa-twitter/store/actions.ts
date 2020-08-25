import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import TwitterState from '../types/TwitterState'
import * as mutationTypes from './mutation-types'

import fetch from 'isomorphic-fetch'
import fetchErrorHandler from 'icmaa-config/helpers/fetchResponseHandler'
import config from 'config'
import { processURLAddress } from '@vue-storefront/core/helpers'

const actions: ActionTree<TwitterState, RootState> = {
  async fetchStatusFeed (context, screenName: string) {
    const { endpoint } = config.icmaa_twitter
    const apiUrl = endpoint + '/feed/' + encodeURIComponent(screenName) + '/3'
    const fetchOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }

    return fetch(processURLAddress(apiUrl), fetchOptions)
      .then(fetchErrorHandler)
      .then(resp => resp.json())
      .then(resp => resp.result && resp.result.items ? resp.result.items : [])
      .catch(() => [])
  },
  async loadStatusFeed ({ dispatch, state, commit }, screenName: string): Promise<any> {
    if (!state.status || Object.keys(state.status).length === 0 || !state.status.find(s => s.screenName === screenName)) {
      const status = await dispatch('fetchStatusFeed', screenName)

      commit(mutationTypes.SN_ICMAA_TWITTER_ADD_STATUS, { screenName, status })
      return status
    } else {
      return new Promise((resolve, reject) => {
        let result = state.status.find(s => s.screenName === screenName)
        if (result) {
          resolve(result)
        } else {
          reject('Error while fetching state for ' + name)
        }
      })
    }
  }
}

export default actions
