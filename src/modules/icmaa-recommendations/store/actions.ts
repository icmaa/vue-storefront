import { ActionTree } from 'vuex'
import { entities } from 'config'
import RootState from '@vue-storefront/core/types/RootState'
import RecommendationsState, { Recommendations } from '../types/RecommendationsState'
import Product from '@vue-storefront/core/modules/catalog/types/Product'
import * as types from './mutation-types'
import Rules from '../helpers/Rules'

const actions: ActionTree<RecommendationsState, RootState> = {
  async single ({ commit, dispatch }, { product, type, size }): Promise<Recommendations|boolean> {
    const productId: string = product.id
    const rules = new Rules(product, type)
    const query = rules.getSearchQuery().build()

    const { includeFields, excludeFields } = entities.productList
    const result = await dispatch('product/findProducts', { query, size, includeFields, excludeFields }, { root: true })
    const products: Product[] = result.items

    const payload = { productId, type, products }
    commit(types.ICMAA_RECOMMENDATIONS_ADD, payload)

    return payload
  }
}

export default actions
