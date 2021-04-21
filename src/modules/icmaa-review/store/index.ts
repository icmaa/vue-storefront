import { Module } from 'vuex'
import getters from './getters'
import actions from './actions'
import ReviewState from '../type/ReviewState'

export const ExtendedReviewStore: Module<ReviewState, any> = {
  actions,
  getters
}
