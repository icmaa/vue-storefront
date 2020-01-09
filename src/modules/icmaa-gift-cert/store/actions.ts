import { ActionTree } from 'vuex'
import { entities } from 'config'
import GiftCertService from '../data-resolver/GiftCertService'
import RootState from '@vue-storefront/core/types/RootState'
import GiftCertState from '../types/GiftCertState'
import * as types from './mutation-types'

const actions: ActionTree<GiftCertState, RootState> = {
  async fetchGiftCert ({ commit }, { number = '', pin = '' } = {}): Promise<boolean> {
    commit(types.ICMAA_GIFTCERT_CLR)

    const result = await GiftCertService.loadGiftCert(number)
    commit(
      types.ICMAA_GIFTCERT_ADD,
      { number: result.cert_number, balance: result.balance, expires: result.expire_at, currency: result.currency_code }
    )
    return true
  },
  clearGiftCert ({ commit }): void {
    commit(types.ICMAA_GIFTCERT_CLR)
  }
}

export default actions
