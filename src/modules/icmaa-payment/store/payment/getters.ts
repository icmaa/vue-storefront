import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import PaymentState from '../../types/PaymentState'

const getters: GetterTree<PaymentState, RootState> = {
  getFactoryKeys: state => Object.keys(state.methodsFactories),
  getFactoryKeyByCode: state => (code: string): string =>
    state.methodsFactoryKeyMap.find(i => i.regExp.test(code))?.mapTo || code,
  isMethod: (state, getters) => (code: string): boolean =>
    getters.getFactoryKeys.includes(code) ||
    getters.getFactoryKeys.includes(getters.getFactoryKeyByCode(code)),
  getMethodFactoryByCode: (state, getters) => (code: string): any | boolean =>
    state.methodsFactories[code] || state.methodsFactories[getters.getFactoryKeyByCode(code)] || false,
  isRegistered: (state) => (code: string): boolean =>
    state.registeredMethods.includes(code),
  getInfoComponentByCode: (state, getters, rootState, rootGetters) => (code: string): any => {
    if (!getters.isMethod(code)) return false
    return rootGetters[`${code}/getInfoComponent`]
  },
  getOrderButtonComponentByCode: (state, getters, rootState, rootGetters) => (code: string): any => {
    if (!getters.isMethod(code)) return false
    return rootGetters[`${code}/getOrderButtonComponent`]
  }
}

export default getters
