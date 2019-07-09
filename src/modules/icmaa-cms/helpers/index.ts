import { localizedRoute, currentStoreView } from '@vue-storefront/core/lib/multistore';

export const localizeRouterLink = (text: string): string => {
  const regex = /(<router-link\sto=")(.*)(">.*<\/router-link>)/gm;
  return text.replace(regex, (match, g1, g2, g3) =>
    [g1, localizedRoute(g2, currentStoreView().storeCode), g3].join(''))
}

export const stringToComponent = (text: string, wrapper: string = 'div'): object => {
  text = localizeRouterLink(text)
  return { template: `<${wrapper}>${text}</${wrapper}>` }
}
