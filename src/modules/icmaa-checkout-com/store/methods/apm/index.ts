import * as types from './mutation-types'
import { Module } from 'vuex'
import actions from './actions'
import { Apm, ApmState } from 'icmaa-checkout-com/types'

export const CODE = 'checkoutcom_apm'

const CheckoutComApmStore: Module<ApmState, any> = {
  namespaced: true,
  state: {
    infoComponent: () => import(
      /* webpackChunkName: "icmaa-checkout-com-method-apm-info" */
      'icmaa-checkout-com/components/methods/apm/Info.vue'
    ),
    loading: false,
    selected: {
      apm: null,
      data: null
    },
    apmList: [],
    apmMap: {
      paypal: null,
      klarna: () => import(
        /* webpackChunkName: "icmaa-checkout-com-method-apm-klarna" */
        'icmaa-checkout-com/components/methods/apm/Klarna.vue'
      ),
      sofort: null
    }
  },
  actions,
  mutations: {
    [types.SET_APM_LIST] (state, list: Apm[]) {
      state.apmList = list
    },
    [types.SET_LOADING] (state, value) {
      state.loading = value === true
    },
    [types.SET_SELECTED_APM] (state, apm: Apm) {
      state.selected.apm = apm
    },
    [types.SET_SELECTED_APM_DATA] (state, data: any) {
      state.selected.data = data
    },
    [types.SET_ERROR_MSG] (state, data: any) {
      state.errorMsg = data
    }
  },
  getters: {
    getInfoComponent: (state) => state.infoComponent,
    getApmList: (state) => state.apmList,
    getApmMap: (state) => state.apmMap,
    getSelected: (state) => state.selected,
    isLoading: (state) => state.loading,
    getErrorMsg: (state) => state.errorMsg
  }
}

export default CheckoutComApmStore
