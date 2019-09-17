
import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import Review from '@vue-storefront/core/modules/review/types/Review'
import ReviewState from '../type/ReviewState'

const getters: GetterTree<ReviewState, RootState> = {
  getReviews: (state): Review[] => state.items.items || [],
  getReviewsCount: (state, getters): number => getters.getReviews.length || 0,
  getReviewsTotalRating: (state, getters): number => {
    const sumReducer = (previous, current) => { return current += previous }
    let totalRatings: number[] = getters.getReviews.map(review => {
      let reviewRatings = review.ratings.map((rating) => rating.percent)
      let sum = reviewRatings.reduce(sumReducer)
      return sum / reviewRatings.length
    })

    let sum = totalRatings.reduce(sumReducer)
    return sum / totalRatings.length
  }
}

export default getters
