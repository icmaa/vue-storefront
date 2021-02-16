import { GetterTree } from 'vuex'
import PageState, { PageStateItem } from '../../types/PageState'
import RootState from '@vue-storefront/core/types/RootState'
import { Route } from 'vue-router'

const getters: GetterTree<PageState, RootState> = {
  getPages: (state) => state.items,
  getPageByIdentifier: (state) => (identifier): PageStateItem => {
    return state.items.find(item => item.identifier === identifier)
  },
  getRouteByIdentifier: (state, getter) => (identifier: string): Record<string, any> => {
    const page = getter.getPageByIdentifier(identifier)
    if (page !== null && (page.content || page.rte)) {
      return {
        name: page.routeName || 'icmaa-cms-page',
        params: { identifier }
      }
    }
  }
}

export default getters
