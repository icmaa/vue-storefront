import { Module } from 'vuex'
import { Logger } from '@vue-storefront/core/lib/logger'

import { storeCode } from '../helper'
import { mergeDeep } from 'apollo-utilities';

export default interface IcmaaMetaStoreState {
  data?: {
    title?: string,
    titleTemplate?: string,
    [propName: string]: any
  }
}

export const IcmaaMetaStore: Module<IcmaaMetaStoreState, any> = {
  namespaced: true,
  state: { },
  getters: {
    getData: state => {
      return state.data
    }
  },
  actions: {
    async load ({ commit }) {
      const metaDefault = await import(/* webpackChunkName: "vsf-meta-default" */ `theme/resource/meta/head`)
        .catch(err => {
          Logger.error(`Unable to load meta infos:`, `icmaa-meta`, err)()
          throw new Error('Unable to load meta infos')
        })

      await import(/* webpackChunkName: "vsf-meta-[request]" */ `theme/resource/meta/head-${storeCode()}`)
        .then(meta => {
          commit('ICMAA_META_SET_DATA', mergeDeep(metaDefault.default, meta.default))
        })
    }
  },
  mutations: {
    ICMAA_META_SET_DATA (state, data) {
      state.data = data
    }
  }
}
