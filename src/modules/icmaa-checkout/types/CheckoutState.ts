export interface Section {
  active: boolean,
  done: boolean
}

export interface PersonalDetails {
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  gender: string,
  dob: string,
  createAccount: boolean
}

export interface PaymentDetails {
  company: string,
  firstname: string,
  lastname: string,
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
  firstname: string,
  lastname: string,
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

export interface PriorityHandling {
  title: string,
  description: string,
  fee: number,
  enabled: boolean
}

export default interface CheckoutState {
  loading: boolean,
  sections: {
    [key: string]: Section
  },
  personalDetails: PersonalDetails,
  shippingDetails: ShippingDetails | {},
  shippingMethod: any,
  paymentDetails: PaymentDetails | {},
  paymentMethod: any,
  paymentMethods: any[],
  shippingMethods: any[],
  priorityHandling: PriorityHandling,
  lastOrderId: number
}
