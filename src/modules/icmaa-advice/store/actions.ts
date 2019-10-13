import { ActionTree } from 'vuex';
import {
  list as listAbstract,
  MutationTypesInterface,
  ListOptionsInterface
} from 'icmaa-cms/store/abstract/actions';

import { adviceStorageKey as storageKey } from './';
import * as types from './mutation-types';
import AdviceState, { AdviceStateItem } from '../types/AdviceState';
import RootState from '@vue-storefront/core/types/RootState';

const documentType = 'advice';
const mutationTypes: MutationTypesInterface = {
  add: types.ICMAA_ADVICE_ADD,
  upd: types.ICMAA_ADVICE_UPD,
  rmv: types.ICMAA_ADVICE_RMV
};

const actions: ActionTree<AdviceState, RootState> = {
  list: async (context): Promise<AdviceStateItem[]> => {
    const options = {
      active: { in: true }
    };

    return listAbstract<AdviceStateItem>({
      documentType,
      mutationTypes,
      storageKey,
      context,
      options,
      identifier: 'uuid'
    });
  }
};

export default actions;
