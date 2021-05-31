import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import PaymentState from '../../types/PaymentState'

const getters: GetterTree<PaymentState, RootState> = {
  isMethod: (state) => (code: string): boolean => Object.keys(state.methodsFactories).includes(code),
  getMethodFactoryByCode: (state) => (code: string): any | boolean => state.methodsFactories[code] || false,
  isRegistered: (state) => (code: string): boolean => state.registeredMethods.includes(code),
  getInfoComponentByCode: (state, getters, rootState, rootGetters) => (code: string): any => {
    if (!getters.isMethod(code)) return false
    return rootGetters[`${code}/getInfoComponent`]
  }
}

export default getters
