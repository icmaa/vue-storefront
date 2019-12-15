import appConfig from 'config'
import { serverHooks } from '@vue-storefront/core/server/hooks'

if (appConfig.storeViews.multistore) {
  serverHooks.afterApplicationInitialized(({ app, config }) => {
    const blacklist = ['/__webpack_hmr']
    const storeCodes = appConfig.storeViews.mapStoreUrlsFor
    const hasStoreCode = new RegExp(`^(?!\\/(${storeCodes.join('|')})\\/).+((?<=\\.html)|(?<!\\.[a-zA-Z0-9]*))$`)

    app.use(hasStoreCode, (req, res, next) => {
      const { baseUrl } = req
      if (!blacklist.includes(baseUrl)) {
        const newUrl = '/' + storeCodes[0] + baseUrl
        console.log('Redirect to default store:', newUrl)
        res.redirect(newUrl)
        return
      }

      next()
    })
  })
}
