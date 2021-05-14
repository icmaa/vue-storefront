import CheckoutState from '@vue-storefront/core/modules/checkout/types/CheckoutState'

export interface Section {
  active: boolean,
  done: boolean
}

export interface ExtendedCheckoutState {
  sections: {
    [key: string]: Section
  }
}

export default interface State extends ExtendedCheckoutState, CheckoutState { }
