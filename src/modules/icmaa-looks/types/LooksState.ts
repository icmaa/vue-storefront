import { AbstractStateItem } from 'icmaa-cms/types/AbstractState'

export interface Look extends AbstractStateItem {
  [id: string]: any,
  enabled: boolean,
  created: string,
  title: string,
  description: string,
  model_name: string,
  products: string[]
}

export default interface LookState {
  items: Look[]
}
