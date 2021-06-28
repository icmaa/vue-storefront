import AbstractState from 'icmaa-payment/types/methods/AbstractState'

export interface CardState extends AbstractState {
  token?: string,
  infoComponent: any,
  validations: any
}

export interface ApmState extends AbstractState {
  additionalData: Record<string, any>|null,
  validations: any
}
