import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import PayPalState from '../type/PayPalState'
import * as mutationTypes from './mutation-types'

const actions: ActionTree<PayPalState, RootState> = {
  async loadSdk ({ getters, commit }) {
    if (getters.isSdkLoaded === true) {
      return true
    }

    const clientId = getters.getClientId
    const currency = getters.getCurrency

    return new Promise<void>(resolve => {
      const script = document.createElement('script')
      script.async = true
      script.src = `//www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`
      script.onload = () => {
        commit(mutationTypes.PAYPAL_SDK_LOADED)
        resolve()
      }

      document.body.appendChild(script)
    })
  }
}

export default actions
