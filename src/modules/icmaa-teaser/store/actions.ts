import { ActionTree } from 'vuex'
import { listQueue as listAbstract, MutationTypesInterface } from 'icmaa-cms/store/abstract/actions'

import { teaserStateKey as stateKey } from './'
import * as types from './mutation-types'
import TeaserState, { TeaserStateItem, TagStateItem } from '../types/TeaserState'
import searchTeaser from '../data-resolver/TeaserService'
import Task from '@vue-storefront/core/lib/sync/types/Task'
import CmsService from 'icmaa-cms/data-resolver/CmsService'
import RootState from '@vue-storefront/core/types/RootState'

import { getCurrentStoreviewDatetime } from 'icmaa-config/helpers/datetime'

const documentType = 'teaser'
const mutationTypes: MutationTypesInterface = {
  add: types.ICMAA_TEASER_ADD,
  upd: types.ICMAA_TEASER_UPD,
  rmv: types.ICMAA_TEASER_RMV
}

const actions: ActionTree<TeaserState, RootState> = {
  list: async (context, { tags }: { tags: string }): Promise<Task> => {
    // const gender = context.rootGetters['user/getSessionData']('gender')
    // const cluster = context.rootGetters['user/getCluster']
    // const teaser = await searchTeaser({ tags, gender, cluster })
    // console.error('TEASER', teaser)

    const datetime = getCurrentStoreviewDatetime()
    const options: any = {
      tag: { 'in_array': tags },
      active: { 'in': true },
      show_from: { 'lt-date': datetime },
      show_to: { 'gt-date': datetime }
    }

    return listAbstract<TeaserStateItem>({ documentType, mutationTypes, stateKey, context, options, identifier: 'uuid' })
  },
  listSync: async (context, task) => {
    task.result.forEach(data => context.commit(mutationTypes.add, data))
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
