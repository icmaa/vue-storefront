import { AbstractStateItem } from 'icmaa-cms/types/AbstractState'
import Product from 'core/modules/catalog/types/Product'

export interface Look extends AbstractStateItem {
  [id: string]: any,
  enabled: boolean,
  created: string,
  title: string,
  description?: string,
  modelInstagram: string,
  products: string[]
}

export default interface LookState {
  items: Look[],
  products: {
    [sku: string]: Product
  }
}
