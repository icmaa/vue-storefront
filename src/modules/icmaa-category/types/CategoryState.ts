import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import Product from '@vue-storefront/core/modules/catalog/types/Product'

export default interface CategoryState {
  lists: CategoryStateListItem[],
  productListingWidget: ProductListingWidgetState[]
}

export interface CategoryStateListItem {
  parent: number,
  list: Record<string, Category[]>
}

export interface ProductListingWidgetState {
  parent: number,
  cluster: number|boolean,
  filterHash: string|boolean,
  list: Product[]
}
