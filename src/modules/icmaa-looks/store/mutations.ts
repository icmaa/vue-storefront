import Vue from 'vue'
import { MutationTree } from 'vuex'
import { mutationsFactory } from 'icmaa-cms/store/abstract/mutations'
import * as types from './mutation-types'
import LooksState from '../types/LooksState'

const mutations: MutationTree<LooksState> = {
  ...mutationsFactory({
    add: types.ICMAA_LOOKS_ADD,
    upd: types.ICMAA_LOOKS_UPD,
    rmv: types.ICMAA_LOOKS_RMV
  }),
  [types.ICMAA_LOOKS_PRODUCTS_ADD]: (state, { products }) => {
    products.forEach(p => {
      Vue.set(state.products, p.sku, p)
    });
  }
}

export default mutations
