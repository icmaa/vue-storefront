import { ActionTree } from 'vuex'
import { single as singleAbstract, list as listAbstract, MutationTypesInterface, SingleOptionsInterface, ListOptionsInterface } from 'icmaa-cms/store/abstract/actions'

import { stateKey } from './'
import * as types from './mutation-types'
import LooksState, { Look } from '../types/LooksState'
import RootState from '@vue-storefront/core/types/RootState'

const documentType = 'look'
const mutationTypes: MutationTypesInterface = {
  add: types.ICMAA_LOOKS_ADD,
  upd: types.ICMAA_LOOKS_UPD,
  rmv: types.ICMAA_LOOKS_RMV
}

const actions: ActionTree<LooksState, RootState> = {
  single: async (context, options: SingleOptionsInterface): Promise<Look> =>
    singleAbstract<Look>({ documentType, mutationTypes, stateKey, context, options }),
  list: async (context, options: ListOptionsInterface): Promise<Look[]> =>
    listAbstract<Look>({ documentType, mutationTypes, stateKey, context, options })
}

export default actions
