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
    const visitorId = getters.getGAVisitorId
    if (!visitorId) return false

    eventType = eventType || 'detail-page-view'

    const productDetails = []
    const productDetailsTypes = ['detail-page-view', 'add-to-cart', 'purchase-complete']
    if (product && productDetailsTypes.includes(eventType)) {
      productDetails.push({
        product: {
          'id': product?.parentSku || product.sku
        }
      })
    }

    const fetchRecommendationProductSkus = await RecommendationsService.listRecommendations({
      visitorId,
      eventType,
      servingConfigs: servingConfigs || 'recommended-for-you',
      userEvent: { productDetails },
      pageSize: size
    }).then(resp => {
      if (resp.code !== 200) return []
      return resp.result || []
    }).catch(() => {
      return false
    })

    if (!fetchRecommendationProductSkus) return false

    const query = addDefaultProductFilter(new SearchQuery())
    query.applyFilter({ key: 'sku', value: { in: fetchRecommendationProductSkus } })

    const options = { separateSelectedVariant: rootGetters['category-next/separateSelectedVariantInProductList'] }
    const { includeFields, excludeFields } = entities.productList

    const result = await dispatch('product/findProducts', { query, includeFields, excludeFields, options }, { root: true })
    const products: Product[] = result.items

    const productId: string = product?.id || null
    const payload = { productId, eventType, servingConfigs, products }
    commit(types.ICMAA_RECOMMENDATIONS_ADD, payload)

    return payload
  }
}

export default actions
