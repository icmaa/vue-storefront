import { ActionTree } from 'vuex'
import rootStore from '@vue-storefront/core/store'
import RootState from '@vue-storefront/core/types/RootState'
import PaymentState from '../../types/PaymentState'
import * as types from './mutation-types'

import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<PaymentState, RootState> = {
  initMethod: async ({ getters, commit, dispatch }, code: string): Promise<void> => {
    if (!getters.isMethod(code) || getters.isRegistered(code)) return
    try {
      return getters.getMethodFactoryByCode(code)()
        .then(async method => {
          rootStore.registerModule(code, method.default)
          commit(types.ADD_METHOD, code)

          await dispatch(`${code}/init`, undefined, { root: true })

          Logger.info('Successfully registered payment vuex store for:', 'icmaa-payment', code)()
        }).catch(err => {
          Logger.error('Couldn\'t register payment vuex store:', 'icmaa-payment', err)()
          return false
        })
    } catch (err) {
      Logger.error('Couldn\'t register payment vuex store:', 'icmaa-payment', err)()
    }
  },
  saveMethod: async ({ getters, dispatch }, code: string): Promise<boolean> => {
    if (!getters.isMethod(code) || !getters.isRegistered(code)) return true
    return dispatch(`${code}/save`, undefined, { root: true })
      .then(result => (result !== undefined) ? result : true)
      .catch(err => {
        Logger.error('Couldn\'t save payment store:', 'icmaa-payment', err)()
        return false
      })
  }
}

export default actions
