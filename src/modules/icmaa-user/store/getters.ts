import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import UserState from '../types/UserState'

import isEmpty from 'lodash-es/isEmpty'

const getters: GetterTree<UserState, RootState> = {
  getCluster (state): string|false {
    return (!isEmpty(state.sessionData) && state.sessionData.cluster)
      ? state.sessionData.cluster.toString() : false
  }
}

export default getters
