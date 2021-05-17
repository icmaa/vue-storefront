import appConfig from 'config'
import { serverHooks } from '@vue-storefront/core/server/hooks'

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

    const handleQueryParams = (url: string, queryObj: Record<string, any>): string => {
      let query = ''
      if (Object.values(queryObj).length > 0) {
        const params = new URLSearchParams(queryObj)
        query += '?' + params.toString()
      }
      return url + query
    }

    app.get(hasStoreCode, (req, res) => {
      const { path } = req
      const newPath = '/' + storeCodes[0] + path

      res.redirect(
        301,
        handleQueryParams(newPath, req.query)
      )

      console.log('Redirect to default-store:', newPath)
    })

    /**
     * Redirect to catalog-overwrite aliases for SSR
     */
    if (appConfig.icmaa_url && appConfig.icmaa_url.catalogOverwrites) {
      const { catalogOverwrites: rewrites } = appConfig.icmaa_url
      for (const rewrite in rewrites) {
        const aliases = rewrites[rewrite].join('|')
        const catalogOverwriteRegexp = new RegExp(`^\\/(${storeCodesStr})\\/(${aliases})$`)
        app.get(catalogOverwriteRegexp, (req, res) => {
          let { path } = req
          const newPath = path.replace(new RegExp(`(${aliases})`), rewrite)

          res.redirect(
            301,
            handleQueryParams(newPath, req.query)
          )

          console.log('Redirecting catalog-overwrite:', newPath)
        })
      }
    }
  })
}
