import { GetterTree } from 'vuex'
import { UrlState } from '@vue-storefront/core/modules/url/types/UrlState'
import RootState from '@vue-storefront/core/types/RootState'
import { LocalizedRoute } from '@vue-storefront/core/lib/types'

export const getters: GetterTree<UrlState, RootState> = {
  getCurrentRouteDispatcher: (state): boolean | LocalizedRoute => {
    return state.dispatcherMap[state.currentRoute.fullPath] || false
  },
  getPrevRouteDispatcher: (state): boolean | LocalizedRoute => {
    return state.dispatcherMap[state.prevRoute.fullPath] || false
  }
}
