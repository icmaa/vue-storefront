import { createListenerHook } from '@vue-storefront/core/lib/hooks'

const {
  hook: overlayClosedHook,
  executor: overlayClosedExecutor
} = createListenerHook<void>()

/** Only for internal usage */
const uiHooksExecutors = {
  overlayClosed: overlayClosedExecutor
}

const uiHooks = {
  /**
   * Hook is fired when the overlay is clicked
   */
  overlayClosed: overlayClosedHook
}

export {
  uiHooks,
  uiHooksExecutors
}
