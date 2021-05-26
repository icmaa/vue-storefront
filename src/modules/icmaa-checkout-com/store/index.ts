import * as types from './mutation-types'
import { State } from '../types'
import { Module } from 'vuex'
import actions from './actions'

export const CheckoutComStore: Module<State, any> = {
  namespaced: true,
  state: {
    isValid: true,
    token: null
  },
  actions,
  mutations: {
    [types.SET_TOKEN] (state, token: string) {
      state.token = token
    },
    [types.SET_IS_VALID] (state, valid: boolean) {
      state.isValid = valid === true
    }
  }
}
