import { VueStorefrontModule, VueStorefrontModuleConfig } from '@vue-storefront/core/lib/module'
import { initCacheStorage } from '@vue-storefront/core/helpers/initCacheStorage'
import { blockModule, cmsBlockStateKey } from './store/block'
import { pageModule, cmsPageStateKey } from './store/page'
import { categoryExtrasModule, cmsCategoryExtrasStateKey } from './store/category-extras'

export const KEY = 'icmaa-cms'
export const cacheStorage = initCacheStorage(KEY)

const moduleConfig: VueStorefrontModuleConfig = {
  key: KEY,
  store: {
    modules: [
      { key: cmsBlockStateKey, module: blockModule },
      { key: cmsPageStateKey, module: pageModule },
      { key: cmsCategoryExtrasStateKey, module: categoryExtrasModule }
    ]
  }
}

export const IcmaaCms = new VueStorefrontModule(moduleConfig)
