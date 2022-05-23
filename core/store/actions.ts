import { ActionTree } from 'vuex'
import * as types from './mutation-types'
import RootState from '@vue-storefront/core/types/RootState'

const actions: ActionTree<RootState, RootState> = {
  async resetUserInvalidateLock ({ commit }) {
    commit(types.USER_TOKEN_INVALIDATE_LOCK_CHANGED, 0)
  },
  async resetUserInvalidation ({ commit }) {
    commit(types.RESET_USER_TOKEN_INVALIDATION)
  },
  addCacheTag ({ commit }, tag) {
    commit(types.ADD_CACHE_TAG, tag)
  }
}

export default actions
