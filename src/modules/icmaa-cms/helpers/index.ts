import { icmaa, defaultStoreCode } from 'config'
import { localizedRoute, currentStoreView } from '@vue-storefront/core/lib/multistore';

export const getLocalizedStoreCode = (): string => {
  const storeView = currentStoreView()
  const isDefaultStoreview = storeView && defaultStoreCode === storeView.storeCode

  if (icmaa.mandant && storeView && !isDefaultStoreview) {
    return `${icmaa.mandant}-${storeView.storeCode}`
  }

  return !storeView || isDefaultStoreview ? null : storeView.i18n.defaultLocale.toLowerCase()
}

export const localizeRouterLink = (text: string): string => {
  const regex = /(<router-link\sto=")(.*)(">.*<\/router-link>)/gm;
  return text.replace(regex, (match, g1, g2, g3) =>
    [g1, localizedRoute(g2, currentStoreView().storeCode), g3].join(''))
}

export const stringToComponent = (text: string, wrapper: string = 'div'): object => {
  text = localizeRouterLink(text)
  return { template: `<${wrapper}>${text}</${wrapper}>` }
}
