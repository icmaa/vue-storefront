import { GetterTree } from 'vuex';
import AdviceState, { AdviceStateItem } from '../types/AdviceState';
import RootState from '@vue-storefront/core/types/RootState';
import itemActions from '@vue-storefront/core/modules/cart/store/actions/itemActions';

import config from 'config';
import head from 'lodash-es/head';

const getters: GetterTree<AdviceState, RootState> = {
  getAdvice: (state): AdviceStateItem[] => state.items,
  getSingleAdvice: (state): AdviceStateItem => {
    return state.items.length > 0 ? state.items.length[0] : [];
  },
  getClusterAdvice: (state, getters, RootState, rootGetters): AdviceStateItem => {
    let items = state.items;
    const cluster = rootGetters['user/getCluster'];

    items = items.filter(i => {
      if (i.cluster.length === 0) {
        return true;
      }

      if (!cluster && i.cluster.includes(config.icmaa_cluster.noClusterValue)) {
        return true;
      }

      return i.cluster.includes(cluster);
    });
    if (items.length === 0) {
      return getters.getSingleAdvice();
    }

    return head(items);
  }
};

export default getters;
