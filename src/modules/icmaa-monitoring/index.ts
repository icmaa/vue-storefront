import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { coreHooks } from '@vue-storefront/core/hooks'

import loggerHook from './lib/datadog/logger'

export const IcmaaMonitoringModule: StorefrontModule = function ({ appConfig }) {
  if (appConfig.icmaa_monitoring.datadog.enabled === true) {
    coreHooks.beforeLogRendered(loggerHook)
  }
}
