import appConfig from 'config'
import path from 'path'
import { promises as fs } from 'fs'
import { IncomingMessage, ServerResponse } from 'http'
import { serverHooks } from '@vue-storefront/core/server/hooks'
import { App } from 'h3'

serverHooks.afterApplicationInitialized(({ app }) => {
  app = (app as App)
  const storeCodes = appConfig.storeViews.mapStoreUrlsFor
  const storeCodesStr = storeCodes.join('|')
  const filePath = path.resolve(__dirname, 'resource/i18n/en-US.csv')

  const sendFile = async (req: IncomingMessage, res: ServerResponse): Promise<any[]> => {
    const csv = await fs.readFile(filePath, 'utf8').then(v => v)
    const phrases = []

    const regex = /^(")(.*)(")$/gm
    csv.split('\n')
      .filter(l => l.length > 0)
      .forEach(line => {
        const [ key, name ] = line.split(/(?<=^".*"),(?=".*"$)/).map(v => v.replace(regex, '$2'))
        phrases.push({ name, value: name })
      })

    return phrases
  }

  const getTranslations = async (req: IncomingMessage, res: ServerResponse) => {
    // We could add caching – but it's just an IO action – so I think it shouldn't create any load
    // if (appConfig.server.useOutputCache) {
    //   const cache = require('@vue-storefront/core/scripts/utils/cache-instance')
    //   const cacheKey = 'default-translations'
    //   const cacheTags = ['cms']

    //   cache.get(cacheKey).then(output => {
    //     if (output !== null) {
    //       res.setHeader('X-VS-Cache', 'Hit')
    //       res.setHeader('X-VS-Cache-Tags', cacheTags.join(' '))
    //       return res.json(output)
    //     } else {
    //       res.setHeader('X-VS-Cache', 'Miss')
    //       return sendFile(req, res)
    //         .then(v => cache.set(cacheKey, v, cacheTags))
    //         .then(v => res.json(v))
    //     }
    //   })
    // } else {
    //   return sendFile(req, res).then(v => res.json(v))
    // }

    res.setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')

    return sendFile(req, res)
  }

  app.use('/default-translations.json', getTranslations)
  app.use(getTranslations, {
    match: url => new RegExp(`/(${storeCodesStr})/default-translations.json`).test(url)
  })
})
