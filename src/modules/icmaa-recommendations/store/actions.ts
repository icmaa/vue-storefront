import { ActionTree } from 'vuex'
import { entities } from 'config'
import { SearchQuery } from 'storefront-query-builder'
import RootState from '@vue-storefront/core/types/RootState'
import RecommendationsState, { Recommendations } from '../types/RecommendationsState'
import RecommendationsService from 'icmaa-recommendations/data-resolver/RecommendationsService'
import Product from '@vue-storefront/core/modules/catalog/types/Product'
import addDefaultProductFilter from 'icmaa-catalog/helpers/defaultProductFilter'
import * as types from './mutation-types'

const actions: ActionTree<RecommendationsState, RootState> = {
  async single ({ commit, dispatch, getters, rootGetters }, { product, eventType, servingConfigs, size }): Promise<Recommendations|boolean> {
    eventType = eventType || 'detail-page-view'
    const fetchRecommendationProductSkus = await RecommendationsService.listRecommendations({
      eventType,
      'servingConfigs': servingConfigs || 'recommended-for-you',
      'visitorId': getters.getGAVisitorId,
      'userEvent': {
        'productDetails': [{
          'product': {
            'id': product.sku
          }
        }]
      },
      'pageSize': size
    }).then(resp => {
      if (resp.code !== 200) return []
      return resp.result || []
    })

    const query = addDefaultProductFilter(new SearchQuery())
    query.applyFilter({ key: 'sku', value: { in: fetchRecommendationProductSkus } })
    query.applySort({ field: 'random', options: {} })

    const options = { separateSelectedVariant: rootGetters['category-next/separateSelectedVariantInProductList'] }
    const { includeFields, excludeFields } = entities.productList

    const result = await dispatch('product/findProducts', { query, includeFields, excludeFields, options }, { root: true })
    const products: Product[] = result.items

    const productId: string = product.id
    const payload = { productId, eventType, servingConfigs, products }
    commit(types.ICMAA_RECOMMENDATIONS_ADD, payload)

    return payload
  }
}

export default actions
