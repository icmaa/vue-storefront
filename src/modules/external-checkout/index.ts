import {StorefrontModule, StorefrontModuleConfig} from '@vue-storefront/core/lib/module'
import {beforeEach} from './router/beforeEach'
import {routes} from './router/routes';

const store = {
  namespaced: true,
  state: {
    key: null
  }
}

export const KEY = 'external-checkout'

const moduleConfig: StorefrontModuleConfig = {
  key: KEY,
  store: {modules: [{key: KEY, module: store}]},
  router: {beforeEach, routes}
}

export const ExternalCheckout = new StorefrontModule(moduleConfig)
