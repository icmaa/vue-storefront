import { ActionTree } from 'vuex'
import { entities } from 'config'
import RootState from '@vue-storefront/core/types/RootState'
import RecommendationsState, { Recommendations } from '../types/RecommendationsState'
import { BlockStateItem } from 'icmaa-cms/types/BlockState'
import Product from '@vue-storefront/core/modules/catalog/types/Product'
import * as types from './mutation-types'
import Rules from '../helpers/Rules'

const actions: ActionTree<RecommendationsState, RootState> = {
  async single ({ commit, dispatch }, { product, type, size }): Promise<Recommendations|boolean> {
    const rulesDTO = await dispatch('getRulesFromCms')
    const rules = new Rules(product, type, rulesDTO)
    const query = rules.getSearchQuery().build()

    const { includeFields, excludeFields } = entities.productList
    const result = await dispatch('product/findProducts', { query, size, includeFields, excludeFields }, { root: true })
    const products: Product[] = result.items

    const productId: string = product.id
    const payload = { productId, type, products }
    commit(types.ICMAA_RECOMMENDATIONS_ADD, payload)

    return payload
  },
  async getRulesFromCms ({ state, dispatch, commit }, identifier: string = 'recommendations'): Promise<Record<string, any>> {
    if (Object.values(state.rules).length > 0) {
      return new Promise(resolve => resolve(state.rules))
    }

    const block: Promise<BlockStateItem> = dispatch(
      'icmaaCmsBlock/single',
      { value: identifier },
      { root: true }
    )

    return block.then(rules => {
      const rulesDTO = JSON.parse(rules.content)
      commit(types.ICMAA_RECOMMENDATIONS_SET_RULES, rulesDTO)
      return rulesDTO
    })
  }
}

export default actions
