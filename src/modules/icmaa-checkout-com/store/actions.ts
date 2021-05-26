import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { State } from '../types'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'

const actions: ActionTree<State, RootState> = {
  placeOrder ({ state }) {
    EventBus.$emit('checkout-do-placeOrder', {
      cardToken: state.token
    })
  }
}

export default actions
