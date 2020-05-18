import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { coreHooks } from '@vue-storefront/core/hooks'

import winstonLoggingHook from './lib/datadog/logger'

export const IcmaaMonitoringModule: StorefrontModule = function () {
  coreHooks.beforeLogRendered(winstonLoggingHook)
}
