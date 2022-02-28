import config from 'config'
import serveStatic from 'serve-static'
import mime from 'mime/lite'
import path from 'path'
import glob from 'glob'
import fetch from 'isomorphic-fetch'
import { path as rootPath } from 'app-root-path'
import { createServer, IncomingMessage, OutgoingMessage, ServerResponse } from 'http'
import { createApp, useQuery, useMethod, assertMethod, Handle, createError, sendError, send, sendRedirect } from 'h3'
import { serverHooksExecutors } from '@vue-storefront/core/server/hooks'
import { storeCodeFromUrlPath } from 'icmaa-config/helpers/store'
import { Context } from './utils/types'

const cache = require('./utils/cache-instance')
const themeRootPath = require('../build/theme-path')
const compilationPage = require('../pages/Compilation')
const ssr = require('./utils/ssr-renderer')
const resolve = file => path.resolve(rootPath, file)
const isProd = process.env.NODE_ENV === 'production'

/** Load server extensions */
const serverExtensions = glob.sync('src/modules/*/server.h3.' + (isProd ? 'js' : 'ts'))
serverExtensions.map(serverModule => {
  require(resolve(serverModule))
})

serverHooksExecutors.afterProcessStarted(config.server)

const app = createApp()

const staticRoutes = {
  '/assets': `${themeRootPath}/assets`,
  '/dist': `${rootPath}/dist`,
  '/service-worker.js': `${rootPath}/dist/service-worker.js`,
  '/service-worker.js.map': `${rootPath}/dist/service-worker.js.map`,
  '/cache-version.json': `${rootPath}/core/build/cache-version.json`
}

export const serveStaticMiddleware = function (path: string) {
  return (req: IncomingMessage, res: OutgoingMessage, next) => {
    const mimeType = mime.getType(path + req.url)
    let maxAge = config.expireHeaders.default
    if (config.expireHeaders.hasOwnProperty(mimeType)) {
      maxAge = config.expireHeaders.get(mimeType)
    }
    return serveStatic(path, { maxAge })(req as any, res as any, next) as Handle
  }
}

Object.entries(staticRoutes).forEach(([routePath, staticPath]) => {
  app.use(routePath, serveStaticMiddleware(staticPath))
})

const apiStatus = async (res: ServerResponse, data, statusCode = 200, dropExcp = true) => {
  if (statusCode > 400) {
    if (dropExcp) {
      const statusMessage = typeof data === 'string' ? data : undefined
      const err = createError({ statusCode, statusMessage, data })
      return sendError(res, err, !isProd)
    }
    res.statusCode = statusCode
  }

  return res.end(data)
}

app.use('/invalidate', async (req, res) => {
  assertMethod(req, ['GET', 'POST'])
  if (config.server.useOutputCache) {
    const query = useQuery(req)
    if (query.tag && query.key) { // clear cache pages for specific query tag
      if (query.key !== config.server.invalidateCacheKey) {
        console.error('Invalid cache invalidation key')
        return apiStatus(res, 'Invalid cache invalidation key', 500)
      }

      const tags = query.tag === '*' ? config.server.availableCacheTags : query.tag.split(',')

      serverHooksExecutors.beforeCacheInvalidated({ tags, req: req as any })

      const subPromises = []
      tags.forEach(tag => {
        if (config.server.availableCacheTags.find(t => t === tag || tag.indexOf(t) === 0)) {
          subPromises.push(cache.invalidate(tag))
        } else {
          console.error(`Invalid tag name ${tag}`)
          subPromises.push(Promise.reject(`Invalid tag name ${tag}`))
        }
      })

      if (config.server.invalidateCacheForwarding) {
        if (!query.forwardedFrom && config.server.invalidateCacheForwardUrl) {
          const url = config.server.invalidateCacheForwardUrl + query.tag + '&forwardedFrom=vs'
          const cacheFoward = fetch(url).then(r => r.json())
          subPromises.push(cacheFoward)
        }
      }

      return Promise.all(subPromises).then(async () => {
        serverHooksExecutors.afterCacheInvalidated({ tags, req: req as any })
        return apiStatus(res, `Tags invalidated successfully [${query.tag}]`)
      }).catch(error => {
        console.error(error)
        return apiStatus(res, error, 500)
      })
    } else {
      console.error('Invalid parameters for Clear cache request')
      return apiStatus(res, 'Invalid parameters for Clear cache request', 500)
    }
  } else {
    return apiStatus(res, 'Cache invalidation is not required, output cache is disabled')
  }
})

serverHooksExecutors.afterApplicationInitialized({ app, config: config.server, isProd })

// Logging middleware for assets that are not found or all other SSR requests
if (isProd) app.use(req => { console.log(new Date().toISOString(), useMethod(req), req.url, useQuery(req)) })

let renderer
let globalContextConfig: any = null
const NOT_ALLOWED_SSR_EXTENSIONS_REGEX = new RegExp(`^.*\\.(${config.server.ssrDisabledFor.extensions.join('|')})$`)
const compileOptions = {
  escape: /{{([^{][\s\S]+?[^}])}}/g,
  interpolate: /{{{([\s\S]+?)}}}/g
}

const templatesCache = ssr.initTemplatesCache(config, compileOptions)

if (isProd) {
  // In production: create server renderer using server bundle and index HTML
  // template from real fs.
  // The server bundle is generated by vue-ssr-webpack-plugin.
  const clientManifest = require(resolve('dist/vue-ssr-client-manifest.json'))
  const bundle = require(resolve('dist/vue-ssr-bundle.json'))
  // src/index.template.html is processed by html-webpack-plugin to inject
  // build assets and output as dist/index.html.
  // TODO: Add dynamic templates loading from (config based?) list
  renderer = ssr.createRenderer(bundle, clientManifest)
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  require(resolve('core/build/dev-server'))(app, (bundle, template) => {
    templatesCache['default'] = ssr.compileTemplate(template, compileOptions) // Important Notice: template switching doesn't work with dev server because of the HMR
    renderer = ssr.createRenderer(bundle)
  })
}

app.use('*', async (req, res) => {
  if (NOT_ALLOWED_SSR_EXTENSIONS_REGEX.test(req.url)) {
    apiStatus(res, `The resource ${req.url} couldn't be served using the VSF server`, 404)
    return
  }

  const s = Date.now()

  const site = req.headers['x-vs-store-code'] as string || 'main'
  const currentKey = `page:${site}:${req.url}`
  const newCacheKey = serverHooksExecutors.beforeBuildCacheKey({ currentKey, req, site })
  const cacheKey = typeof newCacheKey === 'string' ? newCacheKey : currentKey

  const errorHandler = err => {
    if (err && err.code === 404) {
      console.error(`Redirect for resource not found: ${req.url}`)
      return sendRedirect(res, '/page-not-found')
    } else {
      console.error(`Error during render : ${req.url}`)
      if (!isProd) console.error(err)

      serverHooksExecutors.ssrException({ err, req, isProd })
      const storeCode = storeCodeFromUrlPath(req.url)
      return sendRedirect(res, storeCode ? `/${storeCode}/error` : '/error')
    }
  }

  const dynamicRequestHandler = async (renderer, config) => {
    if (!renderer) {
      return send(res, compilationPage, 'text/html')
    }

    const context: Context = ssr.initSSRRequestContext(app, req, res, config)
    return renderer.renderToString(context).then(async output => {
      if (context.server._redirect.isPending()) {
        console.log(`Redirect from [${context.url}]`)
        context.server._redirect.resolver.call(null)
        return
      }

      if (!res.getHeader('content-type')) {
        res.setHeader('Content-Type', 'text/html')
      }

      let tagsArray = []
      if (config.server.useOutputCache &&
          config.server.useOutputCacheTagging &&
          context.output.cacheTags &&
          context.output.cacheTags.size > 0
      ) {
        tagsArray = Array.from(context.output.cacheTags)
        const cacheTags = tagsArray.join(' ')
        res.setHeader('X-VS-Cache-Tags', cacheTags)
        if (!isProd) console.log(`Cache tags for the request: ${cacheTags}`)
      }

      const beforeOutputRenderedResponse = await serverHooksExecutors.beforeOutputRenderedResponse({
        req,
        res,
        context,
        output,
        isProd
      })

      if (typeof beforeOutputRenderedResponse.output === 'string') {
        output = beforeOutputRenderedResponse.output
      } else if (typeof beforeOutputRenderedResponse === 'string') {
        output = beforeOutputRenderedResponse
      }

      output = ssr.applyAdvancedOutputProcessing(context, output, templatesCache, isProd)

      if (config.server.useOutputCache && cache) {
        cache.set(
          cacheKey,
          { headers: res.getHeaders(), body: output, httpCode: res.statusCode },
          tagsArray
        ).catch(err => {
          console.error('Couldn\'t write output-cache:', err.message)
        })
      }

      const afterOutputRenderedResponse = serverHooksExecutors.afterOutputRenderedResponse({
        req,
        res,
        context,
        output,
        isProd
      })

      if (typeof afterOutputRenderedResponse === 'string') {
        return afterOutputRenderedResponse
      } else if (typeof afterOutputRenderedResponse.output === 'string') {
        return afterOutputRenderedResponse.output
      } else {
        return output
      }
    })
  }

  const dynamicCacheHandler = async (config) => {
    if (config.server.useOutputCache && cache) {
      return cache.get(
        cacheKey
      ).then(async output => {
        if (output !== null) {
          if (output.headers) {
            for (const header of Object.keys(output.headers)) {
              res.setHeader(header, output.headers[header])
            }
          }
          res.setHeader('X-VS-Cache', 'Hit')
          res.setHeader('Cache-Control', 'public, max-age=' + config.server.outputCacheDefaultTtl)

          if (output.body) {
            apiStatus(res, output.body, output.httpCode, false)
          } else {
            res.setHeader('Content-Type', 'text/html')
            apiStatus(res, output, output.httpCode, false)
          }

          console.log(`Cache hit [${req.url}], cached request: ${Date.now() - s}ms`)
        } else {
          res.setHeader('X-VS-Cache', 'Miss')
          console.log(`Cache miss [${req.url}], request: ${Date.now() - s}ms`)
          apiStatus(res, await dynamicRequestHandler(renderer, config), null, false)
        }
      }).catch(errorHandler)
    } else {
      apiStatus(res, await dynamicRequestHandler(renderer, config))
    }
  }

  let requestContextConfig: any = config.util.extendDeep({}, config)
  if (globalContextConfig) {
    requestContextConfig = config.util.extendDeep({}, globalContextConfig)
  }

  return dynamicCacheHandler(requestContextConfig)
})

serverHooksExecutors.beforeHttpServerStarted({ app, config: config.server, isProd })

const port = process.env.PORT || config.server.port
const host = process.env.HOST || config.server.host

const server = createServer(app)
server.listen(process.env.PORT || 3000, host)
  .on('listening', () => {
    console.log('VueStorefront server started at:', `http://${host}:${port}`)
    serverHooksExecutors.httpServerIsReady({ server, config: config.server, isProd })
  })
  .on('error', (e) => {
    if ((e as any).code === 'EADDRINUSE') {
      console.log(`The port ${port} is already in use`)
    }
  })
