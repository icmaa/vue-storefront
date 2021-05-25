import CheckoutState from '@vue-storefront/core/modules/checkout/types/CheckoutState'

export interface Section {
  active: boolean,
  done: boolean
}

export interface Agreement {
  agreementId: number,
  name: string,
  content: string,
  checkboxText: string,
  isActive: boolean,
  isHtml: boolean
}

export interface ExtendedCheckoutState {
  loading: boolean,
  sections: {
    [key: string]: Section
  },
  agreements: Agreement[]
}

export interface OverwriteCheckoutState {
  shippingDetails: {
    [key: string]: Section
  },
  paymentDetails: {
    [key: string]: Section
  }
}

export default interface State
  extends ExtendedCheckoutState, OverwriteCheckoutState, Omit<CheckoutState, 'shippingDetails' | 'paymentDetails'> { }
