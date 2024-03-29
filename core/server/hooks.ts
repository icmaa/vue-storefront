import { createListenerHook, createMutatorHook, createAsyncMutatorHook } from '@vue-storefront/core/lib/hooks'
import { Express, Request } from 'express'
import http from 'http'

// To add like tracing which needs to be done as early as possible

const {
  hook: afterProcessStartedHook,
  executor: afterProcessStartedExecutor
} = createListenerHook<any>()

interface BeforeCacheInvalidatedParamter {
  tags: string[],
  req: Request
}

interface AfterCacheInvalidatedParamter {
  tags: string[],
  req: Request
}

const {
  hook: beforeCacheInvalidatedHook,
  executor: beforeCacheInvalidatedExecutor
} = createListenerHook<BeforeCacheInvalidatedParamter>()

const {
  hook: addCacheInvalidatedSubPromiseHook,
  executor: addCacheInvalidatedSubPromiseExecutor
} = createListenerHook<{ promises: Promise<any>[], cache: any, tag: string, req: any }>()

const {
  hook: afterCacheInvalidatedHook,
  executor: afterCacheInvalidatedExecutor
} = createListenerHook<AfterCacheInvalidatedParamter>()

// beforeStartApp
interface Extend {
  app: any,
  config: any,
  isProd: boolean
}

const {
  hook: afterApplicationInitializedHook,
  executor: afterApplicationInitializedExecutor
} = createListenerHook<Extend>()

const {
  hook: beforeHttpServerStartedHook,
  executor: beforeHttpServerStartedExecutor
} = createListenerHook<Extend>()

interface Server {
  server: http.Server,
  config: any,
  isProd: boolean
}

const {
  hook: httpServerIsReadyHook,
  executor: httpServerIsReadyExecutor
} = createListenerHook<Server>()

interface Exception {
  err: Error,
  req: any,
  isProd: boolean
}

const {
  hook: ssrExceptionHook,
  executor: ssrExceptionExecutor
} = createListenerHook<Exception>()

const {
  hook: beforeBuildCacheKeyHook,
  executor: beforeBuildCacheKeyExecutor
} = createMutatorHook<{ currentKey: string, req: any, site: string }, string>()

const {
  hook: beforeOutputRenderedResponseHook,
  executor: beforeOutputRenderedResponseExecutor
} = createMutatorHook<any, string | { output: string, [key: string]: any }>();

const {
  hook: afterOutputRenderedResponseHook,
  executor: afterOutputRenderedResponseExecutor
} = createMutatorHook<any, any>()

/** Only for internal usage in this module */
const serverHooksExecutors = {
  afterProcessStarted: afterProcessStartedExecutor,
  afterApplicationInitialized: afterApplicationInitializedExecutor,
  beforeHttpServerStarted: beforeHttpServerStartedExecutor,
  httpServerIsReady: httpServerIsReadyExecutor,
  ssrException: ssrExceptionExecutor,
  beforeOutputRenderedResponse: beforeOutputRenderedResponseExecutor,
  afterOutputRenderedResponse: afterOutputRenderedResponseExecutor,
  beforeCacheInvalidated: beforeCacheInvalidatedExecutor,
  addCacheInvalidatedSubPromise: addCacheInvalidatedSubPromiseExecutor,
  afterCacheInvalidated: afterCacheInvalidatedExecutor,
  beforeBuildCacheKey: beforeBuildCacheKeyExecutor
}

const serverHooks = {
  /** Hook is fired right at the start of the app.
   * @param void
   */
  afterProcessStarted: afterProcessStartedHook,
  afterApplicationInitialized: afterApplicationInitializedHook,
  beforeHttpServerStarted: beforeHttpServerStartedHook,
  httpServerIsReady: httpServerIsReadyHook,
  ssrException: ssrExceptionHook,
  beforeOutputRenderedResponse: beforeOutputRenderedResponseHook,
  afterOutputRenderedResponse: afterOutputRenderedResponseHook,
  beforeCacheInvalidated: beforeCacheInvalidatedHook,
  addCacheInvalidatedSubPromise: addCacheInvalidatedSubPromiseHook,
  afterCacheInvalidated: afterCacheInvalidatedHook,
  beforeBuildCacheKey: beforeBuildCacheKeyHook
}

export {
  serverHooks,
  serverHooksExecutors
}
