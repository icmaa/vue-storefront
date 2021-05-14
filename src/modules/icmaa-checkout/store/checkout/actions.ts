import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CheckoutState from '../../types/CheckoutState'
import * as types from './mutation-types'

const actions: ActionTree<CheckoutState, RootState> = {
  setSections ({ commit }, sections) {
    commit(types.SET_SECTIONS, sections)
  },
  activateSection ({ commit }, section) {
    commit(types.ACTIVATE_SECTION, section)
  }
}

export default actions
