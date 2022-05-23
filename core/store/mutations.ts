import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import RootState from '@vue-storefront/core/types/RootState'
import { isServer } from '@vue-storefront/core/helpers'

const mutations: MutationTree<RootState> = {
  [types.USER_TOKEN_INVALIDATE_LOCK_CHANGED] (state, payload) {
    state.userTokenInvalidateLock = payload
  },
  [types.RESET_USER_TOKEN_INVALIDATION] (state) {
    state.userTokenInvalidateLock = 0
    state.userTokenInvalidated = null
    state.userTokenInvalidateAttemptsCount = 0
  },
  [types.ADD_CACHE_TAG] (state, tag) {
    if (isServer) state.cacheTags.add(tag)
  }
}

export default mutations
