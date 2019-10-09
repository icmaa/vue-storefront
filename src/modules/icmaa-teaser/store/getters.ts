import { GetterTree } from 'vuex'
import TeaserState, { TeaserStateItem } from '../types/TeaserState'
import RootState from '@vue-storefront/core/types/RootState'
import { isDatetimeInBetween } from '../helper/date'
import forEach from 'lodash-es/forEach'
import isArray from 'lodash-es/isArray'
import intersection from 'lodash-es/intersection'

const getters: GetterTree<TeaserState, RootState> = {
  getTeaser: (state): TeaserStateItem[] => state.items,
  getSmallTeaser: (state, getters) => (tag: string): TeaserStateItem[] => {
    return getters.getFilteredTeaser({ size: 'small', tag: tag.split(',') })
  },
  getLargeTeaser: (state, getters) => (tag: string): TeaserStateItem[] => {
    return getters.getFilteredTeaser({ size: 'large', tag: tag.split(',') })
  },
  getFilteredTeaser: (state, getters, RootState, rootGetters) => (filters): TeaserStateItem[] => {
    let items = state.items
    forEach(filters, (value, key) => {
      if (isArray(value)) {
        items = items.filter(i => {
          if (isArray(i[key])) {
            return intersection(i[key], value).length > 0
          } else {
            return value.includes(i[key])
          }
        })
      } else {
        items = items.filter(i => i[key] === value)
      }
    })

    /** @todo Add cluster filter */
    // const cluster = rootGetters['user/getCluster']
    // if (rootGetters['user/getCluster']) {
    //   items = items.filter(i => i.cluster.includes(cluster))
    // }

    /** @todo Add sort */

    items = items
      .filter(i => isDatetimeInBetween(i.showFrom, i.showTo))
      .filter(i => i.active)

    return items
  }
}

export default getters
