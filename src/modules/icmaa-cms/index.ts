import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'

import registerGenericCmsStateModule from './helpers/genericStateModule'

import { DefaultStore, defaultStateKey } from './store/default'
import { BlockStore, cmsBlockStateKey } from './store/block'
import { PageStore, cmsPageStateKey } from './store/page'
import moduleRoutes from './routes'

export const KEY = 'icmaa-cms'

export const IcmaaCmsModule: StorefrontModule = function ({ store, appConfig, router }) {
  store.registerModule(defaultStateKey, DefaultStore)
  store.registerModule(cmsBlockStateKey, BlockStore)
  store.registerModule(cmsPageStateKey, PageStore)

  // This might not be very clean but – here we can load all CMS content types
  // for a custom urls without creating repeating code for the storage if we don't need much logic behind.
  /** @todo Refactor into a better logic */
  registerGenericCmsStateModule('landing-pages', 'landing-page')

  setupMultistoreRoutes(appConfig, router, moduleRoutes, 10)
}
