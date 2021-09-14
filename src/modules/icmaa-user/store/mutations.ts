import Vue from 'vue'
import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import UserState from '../types/UserState'
import partition from 'lodash-es/partition'

const mutations: MutationTree<UserState> = {
  [types.USER_SET_SESSION_DATA] (state, payload) {
    state.sessionData = payload
  },
  [types.USER_ADD_SESSION_DATA] (state, { key, value }) {
    Vue.set(state.sessionData, key, value)
  },
  [types.USER_RMV_SESSION_DATA] (state, key) {
    Vue.delete(state.sessionData, key)
  },
  [types.USER_ORDERS_HISTORY_UPD] (state, history = []) {
    const [ updItems, newItems ] = partition(history, o => state.orders_history.find(ho => ho.id === o.id))

    state.orders_history = state.orders_history.map(order => {
      const updatedOrder = updItems.find(o => o.id === order.id)
      if (updatedOrder) return updatedOrder
      return order
    })

    if (newItems.length > 0) {
      state.orders_history.push(...newItems)
    }

    state.orders_history.sort((a, b) => b.increment_id - a.increment_id)
  }
}

export default mutations
