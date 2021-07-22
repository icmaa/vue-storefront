import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import PayPalState from '../type/PayPalState'
import * as mutationTypes from './mutation-types'
import { PaypalBypassService } from '../data-resolver/BypassService'
import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<PayPalState, RootState> = {
  async loadSdk ({ dispatch, getters, commit }): Promise<boolean> {
    if (getters.isSdkLoaded === true) {
      return Promise.resolve(true)
    }

    const start = await dispatch('start')
    if (!start) {
      return Promise.resolve(false)
    }

    const clientId = getters.getClientId
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
  },
  async start ({ commit }) {
    return PaypalBypassService.start()
      .then(resp => {
        if (resp?.code === 200) {
          const { result } = resp
          const { clientId, brandName, softDescriptor, referenceId } = result

          commit(mutationTypes.PAYPAL_SET_CLIENT_ID, clientId)
          commit(mutationTypes.PAYPAL_SET_CONFIGS, { brandName, softDescriptor, referenceId })

          return result
        }

        throw Error(resp?.result || 'Error during `start`')
      })
      .catch(e => {
        Logger.error('Can\'t start PayPal checkout:', 'icmaa-paypal', e.message)()
        return false
      })
  },
  async getBypassShipping (_, { address, methodCode }) {
    return PaypalBypassService.shipping({ address, methodCode })
      .then(resp => {
        if (resp?.code === 200) {
          const { result } = resp
          return result
        }

        throw Error(resp?.result || 'Error during `getBypassShipping`')
      })
      .catch(e => {
        Logger.error('Can\'t fetch shipping-informations for PayPal checkout:', 'icmaa-paypal', e.message)()
        return false
      })
  },
  async bypassApprove (_, { payerId, orderId }) {
    return PaypalBypassService.approve({ payerId, orderId })
      .then(resp => {
        if (resp?.code === 200) {
          const { result } = resp
          return result
        }

        throw Error(resp?.result || 'Error during `getBypassShipping`')
      })
      .catch(e => {
        Logger.error('Can\'t fetch shipping-informations for PayPal checkout:', 'icmaa-paypal', e.message)()
        return false
      })
  }
}

export default actions
