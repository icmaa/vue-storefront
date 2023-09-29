import Product from '@vue-storefront/core/modules/catalog/types/Product'

export interface Recommendations {
  eventType: string,
  servingConfigs: string,
  filter?: string,
  productId: string | null,
  products: Product[]
}

export default interface RecommendationsState {
  list: Recommendations[]
}
