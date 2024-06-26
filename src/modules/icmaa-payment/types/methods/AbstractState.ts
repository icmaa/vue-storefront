import { Module, ActionTree, GetterTree } from 'vuex'

interface PaymentActionTree<S, R> extends ActionTree<S, R> {
  init?: any,
  save?: any,
  beforePlaceOrder?: any,
  afterPlaceOrder?: any
}

interface PaymentGetterTree<S, R> extends GetterTree<S, R> {
  getInfoComponent?: any,
  getOrderButton?: any
}

export interface PaymentStore<S, R> extends Module<S, R> {
  namespaced: true,
  actions?: PaymentActionTree<S, R>,
  getters?: PaymentGetterTree<S, R>
}

export default interface AbstractState {
  infoComponent?: (() => Promise<any>) | boolean,
  orderButtonComponent?: (() => Promise<any>),
  [key: string]: any
}
