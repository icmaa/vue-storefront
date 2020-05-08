import { Module } from 'vuex'
import { newsletterStore } from '@vue-storefront/core/modules/newsletter/store'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import NewsletterState from '../types/NewsletterState'

import merge from 'lodash-es/merge'

export const ExtendedNewsletterStore: Module<NewsletterState, any> = {
  actions,
  getters,
  mutations,
  state: merge(newsletterStore.state, {
    voucher: undefined
  })
}
