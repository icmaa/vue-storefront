import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import ConfigState, { ConfigStateStore } from '../types/ConfigState'

import config from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

const getters: GetterTree<ConfigState, RootState> = {
  getMap: (state): ConfigStateStore[] => state.map,
  getCurrentStoreConfig: (state, getters): ConfigStateStore|boolean => {
    const storeCode = currentStoreView().storeCode || config.defaultStoreCode
    if (storeCode) {
      return state.map.find(s => s.storeCode === storeCode) || false
    }

    return false
  }
}

export default getters
