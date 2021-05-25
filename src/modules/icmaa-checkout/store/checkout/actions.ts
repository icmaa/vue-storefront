import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CheckoutState from '../../types/CheckoutState'
import * as types from './mutation-types'
import CheckoutService from '../../data-resolver/CheckoutService'

const actions: ActionTree<CheckoutState, RootState> = {
  loading ({ commit }, status = true) {
    commit(types.SET_LOADING, status)
  },
  setSections ({ commit }, sections) {
    commit(types.SET_SECTIONS, sections)
  },
  activateSection ({ commit, dispatch }, section) {
    dispatch('loading', false)
    commit(types.ACTIVATE_SECTION, section)
  },
  async getAgreements ({ commit }) {
    const agreements = await CheckoutService.getAgreements()
    commit(types.SET_AGREEMENTS, agreements || [])
  }
}

export default actions
