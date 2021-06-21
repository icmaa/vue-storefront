import AbstractState from 'icmaa-payment/types/methods/AbstractState'

export interface CardState extends AbstractState {
  token?: string,
  isValid: boolean,
  infoComponent: any
}

export interface ApmState extends AbstractState {

}
