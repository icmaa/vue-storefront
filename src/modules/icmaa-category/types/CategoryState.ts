import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import Product from '@vue-storefront/core/modules/catalog/types/Product'

export default interface CategoryState {
  lists: CategoryStateListItem[],
  productListingWidget: ProductListingWidgetState[]
}

export interface CategoryStateListItem {
  category: number,
  items: Category[]
}

export interface ProductListingWidgetState {
  parent: number,
  optionsHash: string|boolean,
  list: Product[]
}
