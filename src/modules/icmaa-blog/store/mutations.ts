import { MutationTree } from 'vuex'
import { mutationsFactory } from 'icmaa-cms/store/abstract/mutations'
import * as types from './mutation-types'
import TeaserState from '../types/BlogState'

const mutations: MutationTree<TeaserState> = {
  ...mutationsFactory({
    add: types.ICMAA_BLOG_ADD,
    upd: types.ICMAA_BLOG_UPD,
    rmv: types.ICMAA_BLOG_RMV
  }, 'uuid')
}

export default mutations
