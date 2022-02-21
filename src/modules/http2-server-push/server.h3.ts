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
      const serverPushItems = [];
      for (let { file, asType, extension } of (context as any).getPreloadFiles()) {
        if (extension !== 'js') {
          continue;
        }
        serverPushItems.push(`</dist/${file}>;rel=preload;as=${asType}`)
      }
      if (serverPushItems.length) {
        res.setHeader('Link', serverPushItems)
      }
    }
    return output
  })
}
