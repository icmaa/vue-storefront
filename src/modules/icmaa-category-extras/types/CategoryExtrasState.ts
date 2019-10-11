import { AbstractStateItem } from 'icmaa-cms/types/AbstractState'

export interface CategoryExtrasStateItem extends AbstractStateItem {
  has_logo: boolean,
  crossreference_in_logoline: boolean,
  crossreference_in_product: boolean
}

export interface CategoryExtrasCategoryIdMapChildStateItem {
  id: number,
  url_key: string
}

export interface CategoryExtrasCategoryIdMapStateItem {
  parentId: number,
  children: CategoryExtrasCategoryIdMapChildStateItem[]
}

export default interface CategoryExtrasState {
  items: CategoryExtrasStateItem[],
  childCategoryIdMap: CategoryExtrasCategoryIdMapStateItem[]
}
