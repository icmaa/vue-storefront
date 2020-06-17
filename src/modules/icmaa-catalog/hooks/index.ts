import { createMutatorHook } from '@vue-storefront/core/lib/hooks'
import Product from '@vue-storefront/core/modules/catalog/types/Product'

const {
  hook: afterSelectedVariantHook,
  executor: afterSelectedVariantExecutor
} = createMutatorHook<{ product: Product, configuration: any, selectedVariant: any}, Product[]>()

const icmaaCatalogHooksExecutors = {
  afterSelectedVariant: afterSelectedVariantExecutor
}

const icmaaCatalogHooks = {
  afterSelectedVariant: afterSelectedVariantHook
}

export {
  icmaaCatalogHooks,
  icmaaCatalogHooksExecutors
}
