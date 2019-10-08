import { ActionTree } from 'vuex'
import * as types from './mutation-types'
import RootState from '@vue-storefront/core/types/RootState'
import UserState from '../types/UserState'

const actions: ActionTree<UserState, RootState> = {
  async setCluster ({ commit }, cluster) {
    commit(types.USER_ADD_SESSION_DATA, { key: 'cluster', value: cluster })
  }
}

export default actions
