import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import UserState from '../../types/UserState'

import { processLocalizedURLAddress } from '@vue-storefront/core/helpers'
import { userHooksExecutors } from '@vue-storefront/core/modules/user/hooks'
import * as userTypes from '@vue-storefront/core/modules/user/store/mutation-types'
import config from 'config'
import fetch from 'isomorphic-fetch'
import fetchErrorHandler from 'icmaa-config/helpers/fetchResponseHandler'

const actions: ActionTree<UserState, RootState> = {
  async facebookLogin ({ commit, dispatch }, params: { accessToken: string, version: string}) {
    const { endpoint } = config.icmaa_facebook
    const { accessToken, version } = params
    const apiUrl = processLocalizedURLAddress(endpoint + '/login')
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify({ 'access_token': accessToken, version }),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      mode: 'cors' as RequestMode
    }

    const resp = await fetch(apiUrl, fetchOptions)
      .then(fetchErrorHandler)
      .then(r => r.json())
      .catch(e => { throw new Error(e.response.result) })

    userHooksExecutors.afterUserAuthorize(resp)

    if (resp.code === 200) {
      try {
        await dispatch('resetUserInvalidateLock', {}, { root: true })
        commit(userTypes.USER_TOKEN_CHANGED, { newToken: resp.result }) // TODO: handle the "Refresh-token" header
        await dispatch('sessionAfterAuthorized', { refresh: true, useCache: false })
      } catch (err) {
        await dispatch('clearCurrentUser')
        throw new Error(err)
      }
    }
  }
}

export default actions
