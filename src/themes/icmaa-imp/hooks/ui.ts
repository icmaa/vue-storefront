import { createListenerHook } from '@vue-storefront/core/lib/hooks'

const {
  hook: sidebarClosedHook,
  executor: sidebarClosedExecutor
} = createListenerHook<string>()

/** Only for internal usage */
const uiHooksExecutors = {
  sidebarClosed: sidebarClosedExecutor
}

const uiHooks = {
  sidebarClosed: sidebarClosedHook
}

export {
  uiHooks,
  uiHooksExecutors
}
