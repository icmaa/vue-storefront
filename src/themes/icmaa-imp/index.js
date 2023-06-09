import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'
import App from './App.vue'
import routes from './router'
import mixins from './mixins/defaultMixin'
import Vue from 'vue'
import VueProgressBar from 'vue-progressbar'
import VueScrollTo from 'vue-scrollto'
import '@vue-storefront/core/lib/passive-listeners'
import { once } from '@vue-storefront/core/helpers'

import { claimsStore } from 'theme/store/claims'
import { uiStore } from 'theme/store/ui'
import { registerUserCentricsStore } from 'theme/store/userCentrics'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

once('__VUE_EXTEND_THEME__', () => {
  Vue.use(VueProgressBar, { thickness: '4px' })
  Vue.use(VueScrollTo, { offset: -55 })
  Vue.mixin(mixins)
})

const themeEntry = App
function initTheme (app, router, store, config, ssrContext) {
  // Register theme routes for the current store. In a single store setup this will add routes exactly as they are in the router definition file '[theme]/router/index.js'
  // In a multistore setup, it depends on the config setting 'appendStoreCode' for the current store
  // - true = the store code will be added to the front of all routes, e.g. name: 'de-checkout', path: '/de/checkout'
  // - false = the store code will not be added. In this case you need to define custom routes for each of your stores
  // You can also define custom routes to use a different component, for example for German storeView checkout
  // To do so, exclude the desired storeView from the config.storeViews.mapStoreUrlsFor, set appendStoreCode = false, and map all the urls by your own like:
  // { name: 'de-checkout', path: '/checkout', component: CheckoutCustomized }
  // The 4th parameter is the route priority - a higher number will ensure the theme routes override any module routes. The default is 0.
  setupMultistoreRoutes(config, router, routes, 10)

  StorageManager.init('claims')
  store.registerModule('claims', claimsStore)
  store.registerModule('ui', uiStore)

  registerUserCentricsStore()
}

export {
  themeEntry,
  initTheme
}
