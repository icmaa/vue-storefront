import appConfig from 'config'
import path from 'path'
import fs from 'fs'
import { App, assertMethod } from 'h3'
import { serverHooks } from '@vue-storefront/core/server/hooks'

serverHooks.afterApplicationInitialized(({ app }) => {
  const storeCodes = appConfig.storeViews.mapStoreUrlsFor
  const storeCodesStr = storeCodes.join('|')
  const robotsFilePath = path.resolve(__dirname, 'robots.txt')

  app = (app as App)
  app.use('/robots.txt', (req, res) => {
    assertMethod(req, 'GET')
    return fs.readFileSync(robotsFilePath)
  })

  app.use((req, res) => {
    assertMethod(req, 'GET')
    return fs.readFileSync(robotsFilePath)
  }, {
    match: (url, req) => new RegExp(`/(${storeCodesStr})/robots.txt`).test(url)
  })
})
