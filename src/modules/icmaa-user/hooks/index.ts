import { createAsyncMutatorHook } from '@vue-storefront/core/lib/hooks'

const {
  hook: authorizedSessionStartedHook,
  executor: authorizedSessionStartedExecutor
} = createAsyncMutatorHook<null, null>()

const {
  hook: unauthorizedSessionStartedHook,
  executor: unauthorizedSessionStartedExecutor
} = createAsyncMutatorHook<null, null>()

const icmaaUserHooksExecutors = {
  authorizedSessionStarted: authorizedSessionStartedExecutor,
  unauthorizedSessionStarted: unauthorizedSessionStartedExecutor
}

const icmaaUserHooks = {
  authorizedSessionStarted: authorizedSessionStartedHook,
  unauthorizedSessionStarted: unauthorizedSessionStartedHook
}

export {
  icmaaUserHooks,
  icmaaUserHooksExecutors
}
