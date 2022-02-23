import { serverHooks } from '@vue-storefront/core/server/hooks'
import config from 'config'

if (config.server.http2ServerPush) {
  console.log('HTTP2 Server Push is enabled')

  serverHooks.asyncBeforeOutputRenderedResponse(async ({
    res,
    context,
    output,
    isProd
  }) => {
    if (isProd) {
      return new Promise(async resolve => {
        const spiPromises = []
        const serverPushItems = [];

        for (let { file, asType, extension } of (context as any).getPreloadFiles()) {
          spiPromises.push(new Promise(resolve => {
            if (extension !== 'js') resolve(true)
            serverPushItems.push(`</dist/${file}>;rel=preload;as=${asType}`)
            resolve(true)
          }))
        }

        await Promise.all(spiPromises)

        if (serverPushItems.length > 0) {
          res.setHeader('Link', serverPushItems)
        }

        resolve(output)
      })
    }
    return output
  })
}
