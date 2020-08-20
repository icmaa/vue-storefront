import { defaultStoreCode } from 'config'
import { localizedRoute, currentStoreView } from '@vue-storefront/core/lib/multistore'

export const getCurrentStoreCode = (): string => {
  return !currentStoreView() || currentStoreView().storeCode === defaultStoreCode ? null : currentStoreView().storeCode
}

export const localizeRouterLink = (text: string): string => {
  const regexLink = /(<a\shref=")(?!http)(.*?)(">)(.*?)(<\/a>)/gm
  text = text.replace(regexLink, (match, g1, g2, g3, g4) =>
    ['<router-link to="', g2, g3, g4, '</router-link>'].join(''))

  const regexRouterLink = /(<router-link\sto=")(.*)(">.*<\/router-link>)/gm
  return text.replace(regexRouterLink, (match, g1, g2, g3) =>
    [g1, localizedRoute(g2, currentStoreView().storeCode), g3].join(''))
}

/**
 * @todo
 * This method to load a component by string requires the much bigger `vue.esm` bundle which includes the compiler
 * to render a component on runtime – we don't really need this as we mostly just return HTML including links,
 * but this links again contain links we want to treat as `<router-link>` to have client-side router navigation.
 *
 * @param {string} text
 * @param {string} wrapper
 * @return {object}
 */
export const stringToComponent = (text: string, wrapper: string = 'div'): object => {
  if (!text || typeof text !== 'string') {
    return {}
  }

  text = localizeRouterLink(text)
  return { template: `<${wrapper}>${text}</${wrapper}>` }
}
