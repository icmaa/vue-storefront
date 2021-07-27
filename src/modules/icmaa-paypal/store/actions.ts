import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import PayPalState from '../type/PayPalState'
import * as mutationTypes from './mutation-types'
import { PaypalCheckoutService } from '../data-resolver/CheckoutService'
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
    return PaypalCheckoutService.start()
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
  async getShipping (_, { address, methodCode }) {
    return PaypalCheckoutService.shipping({ address, methodCode })
      .then(resp => {
        if (resp?.code === 200) {
          const { result } = resp
          return result
        }

        throw Error(resp?.result || 'Error during `getShipping`')
      })
      .catch(e => {
        Logger.error('Can\'t fetch shipping-informations for PayPal checkout:', 'icmaa-paypal', e.message)()
        return { error: e.message }
      })
  },
  async approve (_, { payerId, orderId }) {
    return PaypalCheckoutService.approve({ payerId, orderId })
      .then(resp => {
        if (resp?.code === 200) {
          const { result } = resp
          return result
        }

        throw Error(resp?.result || 'Error during `approve`')
      })
      .catch(e => {
        Logger.error('Can\'t approve order:', 'icmaa-paypal', e.message)()
        return { error: e.message }
      })
  },
  async capture (_, { email, address, captureResponse }) {
    return PaypalCheckoutService.capture({ email, address, captureResponse })
      .then(resp => {
        if (resp?.code === 200) {
          return resp
        }

        throw Error(resp?.result || 'Error during `capture`')
      })
      .catch(e => {
        Logger.error('Can\'t capture order:', 'icmaa-paypal', e.message)()
        return { error: e.message }
      })
  },
  async fail (_, payload) {
    return PaypalCheckoutService.fail(payload)
      .then(resp => {
        if (resp?.code === 200) {
          const { result } = resp
          return result
        }

        throw Error(resp?.result || 'Error during `fail`')
      })
      .catch(e => {
        Logger.error('Can\'t revive order:', 'icmaa-paypal', e.message)()
        return { error: e.message }
      })
  }
}

export default actions
