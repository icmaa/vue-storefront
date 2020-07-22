import { createListenerHook } from '@vue-storefront/core/lib/hooks'

const {
  hook: overlayClosedHook,
  executor: overlayClosedExecutor
} = createListenerHook<void>()

const {
  hook: sidebarClosedHook,
  executor: sidebarClosedExecutor
} = createListenerHook<void>()

/** Only for internal usage */
const uiHooksExecutors = {
  overlayClosed: overlayClosedExecutor,
  sidebarClosed: sidebarClosedExecutor
}

const uiHooks = {
  overlayClosed: overlayClosedHook,
  sidebarClosed: sidebarClosedHook
}

export {
  uiHooks,
  uiHooksExecutors
}
