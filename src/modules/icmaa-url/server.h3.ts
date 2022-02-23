import appConfig from 'config'
import { serverHooks } from '@vue-storefront/core/server/hooks'
import { App, assertMethod, sendRedirect } from 'h3'

if (appConfig.storeViews.multistore) {
  serverHooks.afterApplicationInitialized(({ app }) => {
    /**
     * Redirect to default store
     */
    const storeCodes = appConfig.storeViews.mapStoreUrlsFor
    const blacklist = [
      '__webpack_hmr',
      'invalidate',
      '_ah'
    ]

    const blacklistStr = blacklist.join('|')
    const storeCodesStr = storeCodes.join('|')
    const hasStoreCode = new RegExp(
      `^((?!\\/(${storeCodesStr})(\\/|$))(?!\\/(${blacklistStr})$))\\/?.*((?<=\\.html)|(?<!\\.[a-zA-Z0-9]*))$`
    )

    const matchRegExAgainstUrl = (regExp) => (url, req) => regExp.test(url.split('?').shift())

    app = (app as App)
    app.use(async (req, res) => {
      assertMethod(req, 'GET')

      const { url: path } = req
      const newPath = '/' + storeCodes[0] + path

      console.log('Redirect to default-store:', newPath)

      return sendRedirect(res, newPath, 301)
    }, {
      match: matchRegExAgainstUrl(hasStoreCode)
    })

    /**
     * Redirect to catalog-overwrite aliases for SSR
     */
    if (appConfig.icmaa_url && appConfig.icmaa_url.catalogOverwrites) {
      const { catalogOverwrites: rewrites } = appConfig.icmaa_url
      for (const rewrite in rewrites) {
        const aliases = rewrites[rewrite].join('|')
        const catalogOverwriteRegexp = new RegExp(`^\\/(${storeCodesStr})\\/(${aliases})$`)
        app.use(async (req, res) => {
          const { url: path } = req
          const newPath = path.replace(new RegExp(`(${aliases})`), rewrite)

          console.log('Redirecting catalog-overwrite:', newPath)

          return sendRedirect(res, newPath, 301)
        }, {
          match: matchRegExAgainstUrl(catalogOverwriteRegexp)
        })
      }
    }
  })
}
