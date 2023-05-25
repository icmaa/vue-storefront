import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { coreHooks } from '@vue-storefront/core/hooks'
import { Logger } from '@vue-storefront/core/lib/logger'

import { ImageHook } from './types/HookTypes'
import scalecommerce from './provider/ScaleCommerce'
import storyblok from './provider/Storyblok'

const providers: { [provider: string]: ImageHook } = {
  scalecommerce,
  storyblok
}

export const IcmaaCdnModule: StorefrontModule = ({ appConfig }) => {
  /**
   * It would be nice to let this be asynchronous (as before) but the module registration isn't and therefore
   * can lead into a race condition where the picture component is using the wrong image-path because the cdn
   * provider isn't initialized yet. So we can't lazyload the providers using an import-promise.
   */
  const cdn: boolean | string[] = appConfig.icmaa_cdn?.provider || false
  if (Array.isArray(cdn) && appConfig.images.useExactUrlsNoProxy) {
    try {
      cdn.filter(c => providers[c]).forEach(c => {
        const provider = providers[c]
        coreHooks.afterProductThumbnailPathGenerate(provider.afterProductThumbnailPathGenerate)
      })
    } catch (err) {
      Logger.error('Could not load provider:', 'icmaa-cdn', cdn)()
    }
  }
}
