import { Module } from 'vuex'
import getters from './getters'
import ReviewState from '@vue-storefront/core/modules/review/types/ReviewState'

export const ExtendedReviewStore: Module<ReviewState, any> = {
  getters
}
