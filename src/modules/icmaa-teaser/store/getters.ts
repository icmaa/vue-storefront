import { GetterTree } from 'vuex'
import TeaserState, { TeaserStateItem } from '../types/TeaserState'
import RootState from '@vue-storefront/core/types/RootState'
import { isDatetimeInBetween } from '../helper/date'
import forEach from 'lodash-es/forEach'
import isArray from 'lodash-es/isArray'

const getters: GetterTree<TeaserState, RootState> = {
  getTeaser: (state): TeaserStateItem[] => state.items,
  getSmallTeaser: (state, getters) => getters.getFilteredTeaser({ size: 'small' }),
  getLargeTeaser: (state, getters) => getters.getFilteredTeaser({ size: 'large' }),
  getFilteredTeaser: (state) => (filters): TeaserStateItem[] => {
    let items = state.items
    forEach(filters, (value, key) => {
      if (isArray(value)) {
        items = items.filter(i => value.includes(i[key]))
      } else {
        items = items.filter(i => i[key] === value)
      }
    })

    items = items
      .filter(i => isDatetimeInBetween(i.showFrom, i.showTo))
      .filter(i => i.active)

    return items
  }
}

export default getters
