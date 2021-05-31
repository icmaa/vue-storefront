export interface Section {
  active: boolean,
  done: boolean
}

export interface PersonalDetails {
  emailAddress: string,
  firstName: string,
  lastName: string,
  password: string,
  createAccount: boolean
}

export interface PaymentDetails {
  company: string,
  firstName: string,
  lastName: string,
  streetAddress: string,
  city: string,
  country: string,
  country_id: string,
  region_id: number | string,
  postcode: string,
  phoneNumber: string,
  taxId: string,
  paymentMethod: string,
  paymentMethodAdditional: any,
  [key: string]: any
}

export interface ShippingDetails {
  company: string,
  firstName: string,
  lastName: string,
  streetAddress: string,
  city: string,
  country: string,
  country_id: string,
  region_id: number | string,
  postcode: string,
  phoneNumber: string,
  shippingMethod: string,
  [key: string]: any
}

export default interface CheckoutState {
  loading: boolean,
  sections: {
    [key: string]: Section
  },
  personalDetails: PersonalDetails,
  shippingDetails: ShippingDetails | {},
  paymentDetails: PaymentDetails | {},
  order: any,
  paymentMethods: any[],
  shippingMethods: any[],
  isThankYouPage: boolean,
  modifiedAt: number
}
