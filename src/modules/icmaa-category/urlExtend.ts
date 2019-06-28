import { VueStorefrontModule, extendModule } from '@vue-storefront/core/lib/module';
import { Url } from '@vue-storefront/core/modules/url'
import { module } from './store/url'

const icmaaUrl = {
  key: 'url',
  store: { modules: [{ key: 'url', module: module }] }
}

extendModule(icmaaUrl)

export const registerModules: VueStorefrontModule[] = [ Url ]
