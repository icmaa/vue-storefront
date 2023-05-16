import Vue from 'vue'
import { MutationTree } from 'vuex'
import { mutationsFactory } from 'icmaa-cms/store/abstract/mutations'
import * as types from './mutation-types'
import TeaserState from '../types/BlogState'

const mutations: MutationTree<TeaserState> = {
  ...mutationsFactory({
    add: types.ICMAA_BLOG_ADD,
    upd: types.ICMAA_BLOG_UPD,
    rmv: types.ICMAA_BLOG_RMV
  }, 'uuid'),
  [types.ICMAA_BLOG_URL_ADD] (state, { url, ids }: { url: string, ids: string[] }) {
    if (Object.keys(state.urls).includes(url)) {
      Vue.set(state.urls, url, [...state.urls[url], ...ids].filter((v, i, a) => a.indexOf(v) === i))
      return
    }

    Vue.set(state.urls, url, ids)
  }
}

export default mutations
