import { MutationTree } from 'vuex'
import { mutationsFactory } from '../abstract/mutations'
import * as types from './mutation-types'
import CategoryExtrasState from '../../types/CategoryExtrasState'

const mutations: MutationTree<CategoryExtrasState> = {
  ...mutationsFactory({
    add: types.ICMAA_CMS_CATEGORY_EXRTAS_ADD,
    upd: types.ICMAA_CMS_CATEGORY_EXRTAS_UPD,
    rmv: types.ICMAA_CMS_CATEGORY_EXRTAS_RMV
  }),
  [types.ICMAA_CMS_CATEGORY_EXRTAS_DEPARTMENT_CHILDCATEGORIES_ADD] (state, payload) {
    state.departmentChildCategoryIdMap = payload
  }
}

export default mutations
