import { ActionTree } from 'vuex'
import { list as listAbstract, MutationTypesInterface, ListOptionsInterface } from 'icmaa-cms/store/abstract/actions'

import { teaserStorageKey as storageKey } from './'
import * as types from './mutation-types'
import TeaserState, { TeaserStateItem } from '../types/TeaserState'
import RootState from '@vue-storefront/core/types/RootState'

import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import dayjs from 'dayjs'

const documentType = 'teaser'
const mutationTypes: MutationTypesInterface = {
  add: types.ICMAA_TEASER_ADD,
  upd: types.ICMAA_TEASER_UPD,
  rmv: types.ICMAA_TEASER_RMV
}

interface TeaserListOptionsInterface extends ListOptionsInterface {
  tag: string[],
  cluster: string[]
}

const actions: ActionTree<TeaserState, RootState> = {
  list: async (context, filter: TeaserListOptionsInterface): Promise<TeaserStateItem[]> => {
    // const storeLocale = currentStoreView().i18n.defaultLocale.toLocaleLowerCase()
    const currentDateTime = dayjs().format('YYYY-MM-DD HH:mm')

    const options = {
      active: { 'in': true },
      tag: { 'in_array': filter.tag.join(',') },
      cluster: { 'in_array': filter.cluster.join(',') },
      show_from: { 'lt-date': currentDateTime },
      show_to: { 'gt-date': currentDateTime }
    }

    return listAbstract<TeaserStateItem>({ documentType, mutationTypes, storageKey, context, options })
  }
}

export default actions
