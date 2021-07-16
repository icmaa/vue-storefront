import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import PayPalState from '../type/PayPalState'
import * as mutationTypes from './mutation-types'

const actions: ActionTree<PayPalState, RootState> = {
  async loadSdk ({ getters, commit }): Promise<boolean> {
    if (getters.isSdkLoaded === true) {
      return Promise.resolve(true)
    }

    const clientId = 'ARrpPCWTSMu9x6I48yQuhPCBvNgugYfe7Twegv1YSmHeqXJ5onmCZ5bK0umPGR4B61hMg5tl8UzyOjQx'
    const currency = getters.getCurrency

    return new Promise(resolve => {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`
      script.onload = () => {
        commit(mutationTypes.PAYPAL_SDK_LOADED)
        resolve(true)
      }

      script.onerror = (e) => {
        resolve(false)
      }

      document.body.appendChild(script)
    })
  }
}

export default actions
