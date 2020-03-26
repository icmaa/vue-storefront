import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export interface AfterEachHookOptions {
  store: any,
  path: string,
  viewName: string
}

export default ({ store, path, viewName }: AfterEachHookOptions): void => {
  let dataLayer = (window['dataLayer'] = window['dataLayer'] || [])
  const { storeCode } = currentStoreView()

  dataLayer.push({
    'event': 'icmaa-content-view',
    'content-name': path,
    'content-view-name': viewName,
    'store_code': storeCode,
    'customerLoggedIn': store.getters['user/isLoggedIn'],
    'customerEmail': store.getters['user/getUserEmail']
  })
}
