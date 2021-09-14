import { MutationTree } from 'vuex'
import PaymentState from '../../types/PaymentState'
import * as types from './mutation-types'

const mutations: MutationTree<PaymentState> = {
  [types.ADD_METHOD]: (state, code: string) => {
    if (!state.registeredMethods.includes(code)) {
      state.registeredMethods.push(code)
    }
  }
}

export default mutations
