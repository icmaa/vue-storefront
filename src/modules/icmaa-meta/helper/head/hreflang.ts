import { store } from '../'
import { storeViews, icmaa_meta } from 'config'

import { StoreView } from '@vue-storefront/core/lib/multistore'
import { router } from '@vue-storefront/core/app'

export interface HreflangInterface {
  rel: string,
  href: string,
  hreflang?: string,
  [key: string]: any
}

class Hreflang {
  protected _hreflang: HreflangInterface[]

  public getCurrentStoreViewUrlPath (store: StoreView) {
    let path = ''
    if (icmaa_meta && icmaa_meta.base_url) {
      path = router.currentRoute.path
      path = (!store.url.startsWith('/'))
        ? store.url.replace(/\/$/, '') + router.currentRoute.path
        : icmaa_meta.base_url + store.url + path
    }

    return path
  }

  public getHreflanFromConfigs: Function = (store: StoreView): HreflangInterface | boolean => {
    const hreflang = icmaa_meta && icmaa_meta.hreflang && icmaa_meta.hreflang.find(m => m.storeCode === store.storeCode)
    if (hreflang) {
      return {
        rel: 'alternate',
        hreflang: hreflang['lang'],
        href: this.getCurrentStoreViewUrlPath(store)
      }
    }

    return false
  }

  public get hreflang (): HreflangInterface[] {
    if (!this._hreflang) {
      this._hreflang = []

      if (storeViews.multistore) {
        this._hreflang.push({
          rel: 'canonical',
          href: this.getCurrentStoreViewUrlPath(store())
        })

        storeViews.mapStoreUrlsFor.forEach(c => {
          let storeview = storeViews[c]
          if (storeview && !storeview.disabled) {
            const hreflang = this.getHreflanFromConfigs(storeview)
            if (hreflang) {
              this._hreflang.push(hreflang)
            }
          }
        })
      }
    }

    return this._hreflang
  }

  public getItems (): HreflangInterface[] {
    return this.hreflang
  }
}

export default new Hreflang()
