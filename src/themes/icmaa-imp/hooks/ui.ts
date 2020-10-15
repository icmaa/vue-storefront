import { createListenerHook } from '@vue-storefront/core/lib/hooks'

const {
  hook: modalClosedHook,
  executor: modalClosedExecutor
} = createListenerHook<string>()

const {
  hook: sidebarClosedHook,
  executor: sidebarClosedExecutor
} = createListenerHook<string>()

const uiHooksExecutors = {
  sidebarClosed: sidebarClosedExecutor,
  modalClosed: modalClosedExecutor
}

const uiHooks = {
  sidebarClosed: sidebarClosedHook,
  modalClosed: modalClosedHook
}

export {
  uiHooks,
  uiHooksExecutors
}
