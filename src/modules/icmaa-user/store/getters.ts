import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import UserState from '../types/UserState'
import { icmaa } from 'config'

import isEmpty from 'lodash-es/isEmpty'

const getters: GetterTree<UserState, RootState> = {
  isLoggedIn: (state): boolean => !isEmpty(state.current) && !isEmpty(state.token),
  getCustomer: (state): any => state.current,
  getSessionData: (state) => (key: string) => (!isEmpty(state.sessionData) && state.sessionData[key])
    ? state.sessionData[key].toString() : false,
  getSessionFilters: (state, getters): { attributeCode: string, value: any}[] => {
    const sessionFilterAttributes = icmaa.user.clpSessionFilters || []
    return sessionFilterAttributes
      .filter(attributeCode => getters.getSessionData(attributeCode) !== false)
      .map(attributeCode => ({ attributeCode, value: getters.getSessionData(attributeCode) }))
  },
  getSessionFilterKeys: (state, getters): string[] => getters.getSessionFilters.map(f => f.attributeCode),
  hasSessionFilterAttribute: (state, getters) => (attributeCode: string): boolean =>
    getters.getSessionFilterKeys.includes(attributeCode),
  isSessionFilterAttribute: (state, getters) => (attributeCode: string): boolean => {
    const sessionFilterAttributes = icmaa.user.clpSessionFilters || []
    return sessionFilterAttributes.includes(attributeCode)
  },
  getCluster: (state, getters): string|false => getters.getSessionData('cluster')
}

export default getters
