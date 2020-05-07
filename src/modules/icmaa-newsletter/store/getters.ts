import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import NewsletterState, { NewsletterVoucher } from '../types/NewsletterState'

const getters: GetterTree<NewsletterState, RootState> = {
  getVoucher: (state): NewsletterVoucher => state.voucher
}

export default getters
