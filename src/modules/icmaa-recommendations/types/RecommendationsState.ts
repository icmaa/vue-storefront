import Product from '@vue-storefront/core/modules/catalog/types/Product'

export interface Recommendations {
  product: string,
  recommendations: Product[]
}

export default interface RecommendationsState {
  list: Recommendations[]
}
