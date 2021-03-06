import { ActionTree } from 'vuex'
import { list as listAbstract, MutationTypesInterface } from 'icmaa-cms/store/abstract/actions'

import { adviceStateKey as stateKey } from './'
import * as types from './mutation-types'
import AdviceState, { AdviceStateItem } from '../types/AdviceState'
import RootState from '@vue-storefront/core/types/RootState'

import { getCurrentStoreviewDatetime } from 'icmaa-config/helpers/datetime'

const documentType = 'advice'
const mutationTypes: MutationTypesInterface = {
  add: types.ICMAA_ADVICE_ADD,
  upd: types.ICMAA_ADVICE_UPD,
  rmv: types.ICMAA_ADVICE_RMV
}

const actions: ActionTree<AdviceState, RootState> = {
  list: async (context): Promise<AdviceStateItem[]> => {
    const options = {
      i18n_active: { in: true },
      show_from: { 'lt-date': getCurrentStoreviewDatetime() },
      show_to: { 'gt-date': getCurrentStoreviewDatetime() }
    }

    return listAbstract<AdviceStateItem>({
      documentType,
      mutationTypes,
      stateKey,
      context,
      options,
      identifier: 'uuid'
    })
  }
}

export default actions
