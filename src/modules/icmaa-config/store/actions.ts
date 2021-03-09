import config from 'config'
import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import ConfigState, { StoreView } from '../types/ConfigState'
import * as types from './mutation-types'
import { getExtendedStoreviewConfig } from '../helpers'
import { Logger } from '@vue-storefront/core/lib/logger'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

const actions: ActionTree<ConfigState, RootState> = {
  setMap ({ commit }, storeView?: StoreView): StoreView[] {
    Logger.debug('Hydrate store-view config values', 'icmaa-config')()

    const { icmaa_config, storeViews } = config
    let storeConfigs = storeViews.mapStoreUrlsFor.map(storeCode => {
      let store = icmaa_config.map.find(s => s.storeCode === storeCode) || { storeCode }
      store.extend = storeViews[storeCode].extend
      return store
    })

    if (!storeView) storeView = currentStoreView()
    storeConfigs = storeConfigs
      .map(storeConfig => getExtendedStoreviewConfig(storeConfig, storeConfigs))
      .filter(store => store.storeCode === storeView.storeCode)

    commit(types.ICMAA_CONFIG_ADD_MAPS, storeConfigs)
    return storeConfigs
  }
}

export default actions
