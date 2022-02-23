import { serverHooks } from '@vue-storefront/core/server/hooks'
import config from 'config'

if (config.server.http2ServerPush) {
  console.log('HTTP2 Server Push is enabled')

  serverHooks.beforeOutputRenderedResponse(({
    res,
    context,
    output,
    isProd
  }) => {
    if (isProd) {
      const serverPushItems = []
      for (let { file, asType, extension } of (context as any).getPreloadFiles()) {
        if (extension !== 'js') continue
        serverPushItems.push(`</dist/${file}>;rel=preload;as=${asType}`)
      }

      if (serverPushItems.length > 0) {
        try {
          res.setHeader('Link', serverPushItems)
        } catch (e) {
          // throw Error(`Can't add http2-server-push header for ${res.req.url}`)
          console.error(`Can't add http2-server-push header for ${res.req.url}`, e)
        }
      }
    }
    return output
  })
}
