import { removeLocalization } from '@vue-storefront/core/lib/multistore'

export default (urlPath) => {
  return (removeLocalization(urlPath) as string).replace(/^\//, '')
}
