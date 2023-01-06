import { Category } from '../../types/Category';
import Product from 'core/modules/catalog/types/Product';

export default interface CategoryState {
  categoriesMap: { [urlKey: string]: Category },
  notFoundCategoryIds: string[],
  filtersMap: { [urlKey: string]: any },
  products: Product[],
  searchProductsStats: any
}
