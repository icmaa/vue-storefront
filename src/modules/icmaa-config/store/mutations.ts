import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import ConfigState from '../types/ConfigState'

const mutations: MutationTree<ConfigState> = {
  [types.ICMAA_CONFIG_ADD_MAPS] (state, payload) {
    if (state.map.length === 0) {
      state.map = payload
    } else {
      const newConfigs = payload.filter(c => !state.map.find(s => s.storeCode === c.storeCode))
      newConfigs.forEach(storeConfig => {
        state.map.push(storeConfig)
      })
    }
  }
}

export default mutations
