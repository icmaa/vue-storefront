import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import UserState from '../types/UserState'
import { icmaa } from 'config'

import isEmpty from 'lodash-es/isEmpty'
import invert from 'lodash-es/invert'

const getters: GetterTree<UserState, RootState> = {
  isSessionReady: (state): boolean => !!state.session_started,
  isLoggedIn: (state): boolean => !isEmpty(state.current) && !isEmpty(state.token),
  getCustomer: (state): any => state.current,
  getOrdersHistory: (state) => state.orders_history || [],
  getAddresses: (state): any => state.current ? state.current.addresses || [] : [],
  getAddressbyId: (state, getters): any => (id: number) => getters.getAddresses.find(a => a.id === id),
  getSessionData: (state) => (key: string) => (!isEmpty(state.sessionData) && state.sessionData[key])
    ? state.sessionData[key].toString() : false,
  getSessionFilters: (state, getters): { attributeCode: string, value: any}[] => {
    const sessionFilterAttributes = icmaa.user.clpSessionFilters || []
    return sessionFilterAttributes
      .filter(attributeCode => getters.getSessionData(attributeCode) !== false)
      .map(attributeCode => ({ attributeCode, value: getters.getSessionData(attributeCode) }))
  },
  hasSessionFilters: (state, getters): boolean => getters.getSessionFilters.length > 0,
  getSessionFilterKeys: (state, getters): string[] => getters.getSessionFilters.map(f => f.attributeCode),
  hasSessionFilterAttribute: (state, getters) => (attributeCode: string): boolean =>
    getters.getSessionFilterKeys.includes(attributeCode),
  isSessionFilterAttribute: (state, getters) => (attributeCode: string): boolean => {
    const sessionFilterAttributes = icmaa.user.clpSessionFilters || []
    return sessionFilterAttributes.includes(attributeCode)
  },
  getCluster: (state, getters): string|false => getters.getSessionData('cluster'),
  getGender: (state, getters): string|false => {
    const currentGenderId = getters.getSessionData('gender')
    const { genderProductMap: genderMap } = icmaa.user
    return invert(genderMap)[currentGenderId] || false
  },
  getGenderByProductId: () => (id: number): string|false => {
    const { genderProductMap: genderMap } = icmaa.user
    return invert(genderMap)[id] || false
  }
}

export default getters
