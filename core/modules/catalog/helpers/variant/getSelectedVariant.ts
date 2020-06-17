import findConfigurableVariant from './findConfigurableVariant'
import { icmaaCatalogHooksExecutors } from 'icmaa-catalog/hooks'

/**
 * Returns product based on configuration or if there is no match then return first variant as default.
 */
export default function getSelectedVariant (product, configuration, { fallbackToDefaultWhenNoAvailable }) {
  let selectedVariant = findConfigurableVariant({ product, configuration, availabilityCheck: true })
  if (!selectedVariant) {
    if (fallbackToDefaultWhenNoAvailable) {
      selectedVariant = findConfigurableVariant({ product, selectDefaultChildren: true, availabilityCheck: true }) // return first available child
    }
  }

  // MOD < Add a custom event hook to mutate the `selectedVariant`
  selectedVariant = icmaaCatalogHooksExecutors.afterSelectedVariant({ product, configuration, selectedVariant })
  // MOD >

  return selectedVariant
}
