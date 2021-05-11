import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import initGcloudLogger from './lib/gcloud/logger'

export const IcmaaLogsModule: StorefrontModule = function ({ appConfig }) {
  initGcloudLogger()
}
