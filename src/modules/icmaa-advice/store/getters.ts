import { GetterTree } from 'vuex';
import AdviceState, { AdviceStateItem } from '../types/AdviceState';
import RootState from '@vue-storefront/core/types/RootState';

import config from 'config';

const getters: GetterTree<AdviceState, RootState> = {
  getAdvice: (state): AdviceStateItem[] => state.items
};

export default getters;
