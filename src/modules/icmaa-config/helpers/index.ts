import { ConfigStateStore } from '../types/ConfigState'
import merge from 'lodash-es/merge'

export function getExtendedStoreviewConfig (storeView: ConfigStateStore, configStateMap: ConfigStateStore[]): ConfigStateStore {
  if (storeView.extend) {
    const parent: ConfigStateStore = configStateMap.find(s => s.storeCode === storeView.extend)
    if (parent) {
      storeView = merge(
        {},
        getExtendedStoreviewConfig(parent, configStateMap),
        storeView
      )
    }
  }

  return storeView
}
