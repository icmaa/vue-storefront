import { AbstractStateItem } from 'icmaa-cms/types/AbstractState'

export interface CategoryExtrasStateItem extends AbstractStateItem {
  has_logo: boolean,
  crossreference_in_logoline: boolean,
  crossreference_in_product: boolean
}

export interface CategoryExtrasCategoryIdMapStateItem {
  parentId: number,
  children: number[]
}

export default interface CategoryExtrasState {
  items: CategoryExtrasStateItem[],
  childCategoryIdMap: CategoryExtrasCategoryIdMapStateItem[]
}
