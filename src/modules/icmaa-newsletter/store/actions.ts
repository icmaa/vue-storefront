import { ActionTree } from 'vuex'
import { NewsletterService } from '../data-resolver/NewsletterService'
import * as orgTypes from '@vue-storefront/core/modules/newsletter/store/mutation-types'
import * as types from './mutation-types'
import NewsletterState, { NewsletterVoucher } from '../types/NewsletterState'
import Task from '@vue-storefront/core/lib/sync/types/Task'

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
      ServiceTask = NewsletterService.getBirthdayVoucher(options)
    } else {
      ServiceTask = NewsletterService.getVoucher(options)
    }

    return ServiceTask.then((task) => {
      if (task.resultCode !== 200) {
        return false
      }

      commit(types.NEWSLETTER_SET_VOUCHER, task.resultCode)

      return task.result as NewsletterVoucher
    })
  }
}

export default actions
