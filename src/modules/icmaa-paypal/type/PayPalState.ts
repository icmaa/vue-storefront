import AbstractState from 'icmaa-payment/types/methods/AbstractState'

export default interface PayPalState extends AbstractState {
  isSdkLoaded: boolean,
  clientId: string,
  brandName: string,
  softDescriptor: string,
  referenceId: string
}
