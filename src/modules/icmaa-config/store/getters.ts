import { GetterTree } from 'vuex'
import config from 'config'
import RootState from '@vue-storefront/core/types/RootState'
import ConfigState, { StoreView } from '../types/ConfigState'
import { getTranslatedCountries } from '../helpers/i18n/countries'

import { buildBaseStoreView, getExtendedStoreviewConfig } from '@vue-storefront/core/lib/multistore'
import getStoreViewByStoreCode from '@vue-storefront/core/lib/multistore/getStoreViewByStoreCode'

import merge from 'lodash-es/merge'

const getters: GetterTree<ConfigState, RootState> = {
  getCurrentStoreConfig: (state, getters): StoreView|boolean => getters.getCurrentStore,
  getCurrentStore: (state, getters, RootState): StoreView => {
    /**
     * As the storeView is removed from intial-state in `initialStateFactory` to save DOM size it could be possible
     * that `RootState.storeView` is only a bare object. Normally the state is populated soon enought to fetch its informations
     * from the state. But there are some places where it's not yet populated, e.g. in the `metaInfo` property in PDP, where
     * the object would be empty so we need to "polyfill-build" it from the configs to get for example `i18n` values.
     * Note: This is only called if the `storeView` state-object is not yet populated.
     * @see https://github.com/DivanteLtd/vue-storefront/issues/3674
     */
    if (Object.keys(RootState.storeView).length === 1 && RootState.storeView.storeCode) {
      const storeCode = RootState.storeView.storeCode
      if (storeCode && config.storeViews.multistore && getStoreViewByStoreCode(storeCode)) {
        return merge(buildBaseStoreView(), getExtendedStoreviewConfig(getStoreViewByStoreCode(storeCode)))
      }
    }

    return RootState.storeView
  },
  getCountries: () => getTranslatedCountries(),
  getCountryNameByCode: (state, getters) => (code: string): string => {
    const country = getters.getCountries.find(c => c.code === code)
    return country.name || code
  }
}

export default getters
