import config from 'config'
import serveStatic from 'serve-static'
import mime from 'mime/lite'
import { createServer, IncomingMessage, OutgoingMessage } from 'http'
import { createApp, useQuery, useMethod, Handle } from 'h3'
import { serverHooksExecutors } from '@vue-storefront/core/server/hooks'

const path = require('path')
const glob = require('glob')
const rootPath = require('app-root-path').path
const themeRootPath = require('../build/theme-path')
const resolve = file => path.resolve(rootPath, file)

/** Load server extensions */
const serverExtensions = glob.sync('src/modules/*/server.js')
const configProviders: Function[] = []
serverExtensions.map(serverModule => {
  const module = require(resolve(serverModule))
  if (module.configProvider && typeof module.configProvider === 'function') {
    configProviders.push(module.configProvider)
  }
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

const serveStaticMiddleware = function (path: string) {
  return (req: IncomingMessage, res: OutgoingMessage, next) => {
    const mimeType = mime.getType(path + req.url)
    let maxAge = config.expireHeaders.default;
    if (config.expireHeaders.hasOwnProperty(mimeType)) {
      maxAge = config.expireHeaders.get(mimeType);
    }
    return serveStatic(path, { maxAge })(req as any, res as any, next) as Handle
  }
}

Object.entries(staticRoutes).forEach(([routePath, staticPath]) => {
  app.use(routePath, serveStaticMiddleware(staticPath))
})

/** @todo Handle invalidate requests */
// app.post('/invalidate', invalidateCache)
// app.get('/invalidate', invalidateCache)

app.use((req) => {
  console.log(
    Date.now(),
    useMethod(req),
    req.url,
    useQuery(req)
  )
})

app.use('*', (req) => {
  return 'Hello world!'
})

let port = process.env.PORT || config.server.port
const host = process.env.HOST || config.server.host

createServer(app)
  .listen(process.env.PORT || 3000, host)
  .on('listening', () => {
    console.log('VueStorefront server started at:', `http://${host}:${port}`)
  })
  .on('error', (e) => {
    if ((e as any).code === 'EADDRINUSE') {
      console.log(`The port ${port} is already in use`)
    }
  })
