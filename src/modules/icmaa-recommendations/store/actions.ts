import { ActionTree } from 'vuex'
import { entities } from 'config'
import RootState from '@vue-storefront/core/types/RootState'
import RecommendationsState, { Recommendations } from '../types/RecommendationsState'
import { BlockStateItem } from 'icmaa-cms/types/BlockState'
import Product from '@vue-storefront/core/modules/catalog/types/Product'
import * as types from './mutation-types'
import Rules from '../helpers/Rules'
import sampleSize from 'lodash-es/sampleSize'

const actions: ActionTree<RecommendationsState, RootState> = {
  async single ({ commit, dispatch }, { product, type, size }): Promise<Recommendations|boolean> {
    const rulesDTO = await dispatch('getRulesFromCms')
    const rules = new Rules(product, type, rulesDTO)
    const query = rules.getSearchQuery()
    const { random, criteria } = rules.getSort()
    const displaySize = size
    if (random === true) {
      size *= 2
    }

    const { includeFields, excludeFields } = entities.productList
    const result = await dispatch('product/findProducts', { query, size, includeFields, excludeFields, criteria }, { root: true })
    const products: Product[] = sampleSize(result.items, displaySize)

    const productId: string = product.id
    const payload = { productId, type, products }
    commit(types.ICMAA_RECOMMENDATIONS_ADD, payload)

    return payload
  },
  async getRulesFromCms ({ state, dispatch, commit }, identifier: string = 'recommendations'): Promise<Record<string, any>> {
    const block: Promise<BlockStateItem> = dispatch(
      'icmaaCmsBlock/single',
      { value: identifier },
      { root: true }
    )

    return block.then(rules => JSON.parse(rules.content))
  }
}

export default actions
