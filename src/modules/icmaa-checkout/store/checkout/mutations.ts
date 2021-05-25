import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import CheckoutState, { Agreement } from '../../types/CheckoutState'

const mutations: MutationTree<CheckoutState> = {
  [types.SET_LOADING] (state, status) {
    state.loading = status
  },
  [types.SET_SECTIONS] (state, sections = {}) {
    state.sections = sections
  },
  [types.ACTIVATE_SECTION] (state, key) {
    let currentIndex = false
    for (let k in state.sections) {
      state.sections[k].active = false
      if (k === key) currentIndex = true
      state.sections[k].done = !currentIndex
    }

    state.sections[key].active = true
  },
  [types.SET_AGREEMENTS] (state, agreements: Agreement[] = []) {
    state.agreements = agreements
  }
}

export default mutations
