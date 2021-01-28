import { GetterTree } from 'vuex'
import AdviceState, { AdviceStateItem } from '../types/AdviceState'
import RootState from '@vue-storefront/core/types/RootState'

import config from 'config'
import head from 'lodash-es/head'

const getters: GetterTree<AdviceState, RootState> = {
  getAdvice: (state): AdviceStateItem[] => state.items,
  getSingleAdvice: (state, getters, RootState, rootGetters): AdviceStateItem => {
    let items = state.items.filter(i => i.active === true)

    const cluster = rootGetters['user/getCluster']
    items = items.filter(i => {
      if (i.cluster.length === 0) {
        return true
      }

      if (!cluster && i.cluster.includes(config.icmaa.user.noClusterValue)) {
        return true
      }

      return i.cluster.includes(cluster)
    })

    return head(items)
  }
}

export default getters
