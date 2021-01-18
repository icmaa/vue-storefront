import { GetterTree } from 'vuex'
import TeaserState, { TeaserStateItem, TagStateItem } from '../types/TeaserState'
import RootState from '@vue-storefront/core/types/RootState'

import config from 'config'
import { isDatetimeInBetween } from 'icmaa-config/helpers/datetime'

import forEach from 'lodash-es/forEach'
import isArray from 'lodash-es/isArray'
import intersection from 'lodash-es/intersection'
import orderBy from 'lodash-es/orderBy'

interface TeaserByTypeOptions { size: 'small'|'large', tag: string, cluster?: string|boolean, gender?: string|boolean }

const getters: GetterTree<TeaserState, RootState> = {
  getTeaser: (state): TeaserStateItem[] => state.items,
  getTeaserByType: (state, getters) => ({ size, tag, cluster, gender }: TeaserByTypeOptions): TeaserStateItem[] => {
    let filter: any = { size, tag: tag.split(',') }
    return getters.getFilteredTeaser(filter)
  },
  getFilteredTeaser: (state, getters, RootState, rootGetters) => (filters: Record<string, any>): TeaserStateItem[] => {
    let items = state.items

    const cluster = filters.cluster || rootGetters['user/getCluster']
    if (filters.hasOwnProperty('cluster')) {
      delete filters.cluster
    }

    items = items.filter(i => {
      if (i.cluster.length === 0 || (!cluster && i.cluster.includes(config.icmaa.user.noClusterValue))) {
        return true
      }
      return i.cluster.includes(cluster)
    })

    const gender = filters.gender || rootGetters['user/getSessionData']('gender')
    if (filters.hasOwnProperty('gender')) {
      delete filters.gender
    }

    items = items.filter(i => {
      if ((i.gender === '' || !i.gender) || (!gender && i.gender === 'none')) {
        return true
      }
      return i.gender === gender
    })

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

    items = items
      .filter(i => isDatetimeInBetween(i.showFrom, i.showTo))
      .filter(i => i.active)

    /**
     * Order result array
     * @see https://vuejs.org/v2/guide/migration.html#Replacing-the-orderBy-Filter
     * */
    items = orderBy(items, ['order'], ['desc'])

    return items
  },
  getTags: (state): TagStateItem[] => state.tags
}

export default getters
