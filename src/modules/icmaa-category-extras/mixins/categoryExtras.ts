import { isServer } from '@vue-storefront/core/helpers'
import isEmpty from 'lodash-es/isEmpty'

export default {
  mounted () {
    this.fetchAsyncData()
  },
  watch: {
    getCurrentCategory: function (category, lastCategory) {
      if (category && !isEmpty(category) && category.url_key !== lastCategory.url_key) {
        this.fetchAsyncData()
      }
    }
  },
  methods: {
    fetchContentHeader (urlKey) {
      // Only load them client-side, we use the queue in this action which won't work on SSR
      return !isServer ? this.$store.dispatch('icmaaCategoryExtras/loadContentHeader', urlKey) : true
    },
    fetchSpotifyArtists (category) {
      if (isServer) return
      return this.$store.dispatch('icmaaSpotify/fetchRelatedArtists', category)
    },
    async fetchAsyncData () {
      const category = this.$store.getters['category-next/getCurrentCategory']
      if (category && !isEmpty(category)) {
        await Promise.all([
          this.fetchSpotifyArtists(category),
          this.fetchContentHeader(category.url_key)
        ])
      }
    }
  }
}
