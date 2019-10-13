import { AbstractStateItem } from 'icmaa-cms/types/AbstractState'

export interface AdviceStateItem extends AbstractStateItem {
  textColor: string,
  [key: string]: any
}

export default interface AdviceState {
  items: AdviceStateItem[]
}
