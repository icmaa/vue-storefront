import Vue from 'vue'
import config from 'config'

export default Vue.extend({
  methods: {
    /**
     * For some reason the `metaInfo` method is not called when nested, so we need to call it manually as a method.
     * This also only works in production-mode – vue-meta seems to have some problems with HMR.
     */
    metaInfo (isArticle = false) {
      const link = []

      let allowedStores: string[] = isArticle
        ? this?.article?.storeView || []
        : config?.icmaa_blog?.allowedStores || []

      config.storeViews.mapStoreUrlsFor.forEach(storeCode => {
        if (allowedStores.includes(storeCode)) return
        link.push({ vmid: `hreflang-${storeCode}`, skip: true })
      })

      const meta = [
        {
          vmid: 'description',
          name: 'description',
          content: this.$t('Impericon Mag – your magazine with the latest news, albums & videos from metalcore, hardcore, deathcore, rock, metal & pop punk.')
        }
      ]

      return { meta, link }
    }
  }
})
