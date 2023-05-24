import Vue from 'vue'
import { MutationTree } from 'vuex'
import { mutationsFactory } from 'icmaa-cms/store/abstract/mutations'
import * as types from './mutation-types'
import TeaserState from '../types/BlogState'

type AddBlogPayload = {
  url: string,
  ids: string[],
  start: number,
  perPage: number,
  total: number
}

const mutations: MutationTree<TeaserState> = {
  ...mutationsFactory({
    add: types.ICMAA_BLOG_ADD,
    upd: types.ICMAA_BLOG_UPD,
    rmv: types.ICMAA_BLOG_RMV
  }, 'uuid'),
  [types.ICMAA_BLOG_URL_ADD] (state, { url, ids, start, perPage, total }: AddBlogPayload) {
    if (Object.keys(state.urls).includes(url)) {
      const current = state.urls[url]
      const next = start > current.start
      const action = next ? 'push' : 'unshift'

      let collectIds = [...current.ids]
      collectIds[action](...ids)
      collectIds = collectIds.filter((v, i, a) => a.indexOf(v) === i)

      Vue.set(state.urls, url, {
        start: start < current.start ? start : current.start,
        perPage,
        total,
        ids: collectIds
      })
      return
    }

    Vue.set(state.urls, url, { ids, start, perPage, total })
  }
}

export default mutations
