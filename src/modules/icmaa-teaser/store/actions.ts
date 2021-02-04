import { ActionTree } from 'vuex'
import { elasticList as elasticListAbstract, MutationTypesInterface } from 'icmaa-cms/store/abstract/actions'

import { teaserStateKey as stateKey } from './'
import * as types from './mutation-types'
import TeaserState, { TeaserStateItem, TagStateItem } from '../types/TeaserState'
import createTeaserQuery from '../helpers/queryBuilder'
import CmsService from 'icmaa-cms/data-resolver/CmsService'
import RootState from '@vue-storefront/core/types/RootState'

const entityType = 'teaser'
const mutationTypes: MutationTypesInterface = {
  add: types.ICMAA_TEASER_ADD,
  upd: types.ICMAA_TEASER_UPD,
  rmv: types.ICMAA_TEASER_RMV
}

const actions: ActionTree<TeaserState, RootState> = {
  list: async (context, { tags, size, gender, cluster }: { tags: string, size?: string, cluster?: string, gender?: string }) => {
    const query = createTeaserQuery({ tags, gender, cluster, size })
    return elasticListAbstract<TeaserStateItem, TeaserState, RootState>({ entityType, mutationTypes, stateKey, context, query })
  },
  fetchTags: async ({ commit }): Promise<TagStateItem[]|boolean> => {
    return CmsService.datasource<TagStateItem[]>({ code: 'tags' })
      .then(results => {
        if (results) {
          commit(types.ICMAA_TEASER_TAGS_SET, results)
        }

        return results
      })
  }
}

export default actions
