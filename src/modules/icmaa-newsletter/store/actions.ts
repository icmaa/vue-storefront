import { ActionTree } from 'vuex'
import { NewsletterService } from '../data-resolver/NewsletterService'
import * as orgTypes from '@vue-storefront/core/modules/newsletter/store/mutation-types'
import * as types from './mutation-types'
import NewsletterState, { NewsletterVoucher } from '../types/NewsletterState'
import Task from '@vue-storefront/core/lib/sync/types/Task'

import omit from 'lodash-es/omit'

const actions: ActionTree<NewsletterState, any> = {
  async status ({ commit, rootGetters }, email): Promise<boolean> {
    const customer = rootGetters['user/getCustomer']
    const isSubscribed = rootGetters['user/isLoggedIn']
      ? customer.is_subscribed
      : false

    if (isSubscribed) {
      commit(orgTypes.SET_EMAIL, email)
      commit(orgTypes.NEWSLETTER_SUBSCRIBE)
    } else {
      commit(orgTypes.NEWSLETTER_UNSUBSCRIBE)
    }

    return isSubscribed
  },
  async getVoucher ({ commit, getters }, options: { email: string, rule?: number, birthday?: boolean }): Promise<NewsletterVoucher|boolean> {
    if (getters.getVoucher) {
      return getters.getVoucher
    }

    let ServiceTask: Promise<Task>
    if (options.birthday) {
      ServiceTask = NewsletterService.getBirthdayVoucher(omit(options, ['birthday']))
    } else {
      ServiceTask = NewsletterService.getVoucher(options)
    }

    return ServiceTask.then((repsonse) => {
      if (repsonse.resultCode !== 200) {
        commit(types.NEWSLETTER_SET_VOUCHER, { error: true, msg: repsonse.result })
      } else {
        commit(types.NEWSLETTER_SET_VOUCHER, repsonse.result)
      }

      return repsonse.result as NewsletterVoucher
    })
  }
}

export default actions
