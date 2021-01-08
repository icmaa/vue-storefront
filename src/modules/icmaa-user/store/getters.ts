import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import UserState from '../types/UserState'

import isEmpty from 'lodash-es/isEmpty'

const getters: GetterTree<UserState, RootState> = {
  isLoggedIn: (state): boolean => !isEmpty(state.current) && !isEmpty(state.token),
  getCustomer: (state): any => state.current,
  getSessionData: (state) => (key: string) => (!isEmpty(state.sessionData) && state.sessionData[key])
    ? state.sessionData[key].toString() : false,
  getGender: (state, getters): string|false => getters.getSessionData('gender'),
  getCluster: (state, getters): string|false => getters.getSessionData('cluster'),
  getClusterString: (state, getters, RootState, RootGetters): string|false => {
    if (getters.getCluster) {
      return RootGetters['attribute/getOptionLabel']({ attributeKey: 'customercluster', optionId: getters.getCluster })
    }

    return false
  }
}

export default getters
