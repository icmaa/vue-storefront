import { ActionTree } from 'vuex'
import { quickSearchByQuery } from '@vue-storefront/core/lib/search'
import { createLoadReviewsQuery } from '@vue-storefront/core/modules/review/helpers'
import RootState from '@vue-storefront/core/types/RootState'
import ReviewState from '@vue-storefront/core/modules/review/types/ReviewState'
import * as types from '@vue-storefront/core/modules/review/store/mutation-types'

const actions: ActionTree<ReviewState, RootState> = {
  /**
   * Copy of original – changes:
   * * Add descending date sorting using `applySort`
   */
  async list ({ commit }, { productId, approved = true, start = 0, size = 50, entityType = 'review', sort = '', excludeFields = null, includeFields = null }) {
    const query = createLoadReviewsQuery({ productId, approved })
    query.applySort({ field: 'created_at', options: 'desc' })

    const reviewResponse = await quickSearchByQuery({ query, start, size, entityType, sort, excludeFields, includeFields })
    commit(types.REVIEW_UPD_REVIEWS, reviewResponse)
  }
}

export default actions
