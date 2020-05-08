import Vue from 'vue'
import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import NewsletterState from '../types/NewsletterState'

const mutations: MutationTree<NewsletterState> = {
  [types.NEWSLETTER_SET_VOUCHER] (state, payload) {
    Vue.set(state, 'voucher', payload)
  }
}

export default mutations
