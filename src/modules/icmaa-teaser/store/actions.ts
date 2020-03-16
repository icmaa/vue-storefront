import { ActionTree } from 'vuex'
import { list as listAbstract, MutationTypesInterface, ListOptionsInterface } from 'icmaa-cms/store/abstract/actions'

import { teaserStorageKey as storageKey } from './'
import * as types from './mutation-types'
import TeaserState, { TeaserStateItem, TagStateItem } from '../types/TeaserState'
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
  list: async (context, tags: string): Promise<TeaserStateItem[]> => {
    const datetime = getCurrentStoreviewDatetime()
    const options = {
      tag: { 'in_array': tags },
      active: { 'in': true },
      show_from: { 'lt-date': datetime },
      show_to: { 'gt-date': datetime }
    }

    return listAbstract<TeaserStateItem>({ documentType, mutationTypes, storageKey, context, options, identifier: 'uuid' })
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
