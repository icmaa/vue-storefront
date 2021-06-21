import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import PaymentState from '../../types/PaymentState'

const getters: GetterTree<PaymentState, RootState> = {
  getFactoryKeyByCode: (state) => (code: string): string =>
    state.methodsFactoryKeyMap.find(i => i.regExp.test(code))?.mapTo || code,
  isMethod: (state, getters) => (code: string): boolean =>
    Object.keys(state.methodsFactories).includes(getters.getFactoryKeyByCode(code)),
  getMethodFactoryByCode: (state, getters) => (code: string): any | boolean =>
    state.methodsFactories[getters.getFactoryKeyByCode(code)] || false,
  isRegistered: (state, getters) => (code: string): boolean =>
    state.registeredMethods.includes(code),
  getInfoComponentByCode: (state, getters, rootState, rootGetters) => (code: string): any => {
    if (!getters.isMethod(code)) return false
    return rootGetters[`${code}/getInfoComponent`]
  }
}

export default getters
