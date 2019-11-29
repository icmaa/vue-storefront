import { ActionTree } from 'vuex'
import { single as singleAbstract, list as listAbstract, MutationTypesInterface, SingleOptionsInterface, ListOptionsInterface } from 'icmaa-cms/store/abstract/actions'
import FormService from '../data-resolver/FormService'

import { competitionsStorageKey as storageKey } from './'
import * as types from './mutation-types'
import CompetitionsState, { Competition } from '../types/CompetitionsState'
import RootState from '@vue-storefront/core/types/RootState'

const documentType = 'competition'
const mutationTypes: MutationTypesInterface = {
  add: types.ICMAA_COMPETITIONS_ADD,
  upd: types.ICMAA_COMPETITIONS_UPD,
  rmv: types.ICMAA_COMPETITIONS_RMV
}

const actions: ActionTree<CompetitionsState, RootState> = {
  single: async (context, options: SingleOptionsInterface): Promise<Competition> =>
    singleAbstract<Competition>({ documentType, mutationTypes, storageKey, context, options }),
  list: async (context, options: ListOptionsInterface): Promise<Competition[]> =>
    listAbstract<Competition>({ documentType, mutationTypes, storageKey, context, options }),
  post: async ({ state }, { sheetId, data }): Promise<boolean> => {
    return FormService.sendForm(sheetId, data)
  }
}

export default actions
