import { storeCode } from 'icmaa-meta/helper'
import { htmlDecode } from '@vue-storefront/core/filters'
import config from 'config'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('icmaaCmsPage', ['getPages']),

    cmsTitle () {
      return this.getPages.metaTitle ? this.getPages.metaTitle : '';
    },

    cmsUrl () {
      return config.icmaa_meta.base_url + '/' + storeCode() + '/' + this.getPages.identifier; // TODO storecode "default"
    },
    cmsDescription () {
      return this.getPages.metaDescription ? this.getPages.metaDescription : '';
    },
    cmsOgImage () {
      return this.getPages.metaOgImage ? this.getPages.metaOgImage : '';
    }
  },
  metaInfo () {
    return {
      title: htmlDecode(this.cmsTitle),
      meta: [
        { vmid: 'description', name: 'description', content: htmlDecode(this.cmsDescription) },
        { vmid: 'og:url', property: 'og:url', content: 'url' },
        { vmid: 'og:title', property: 'og:title', content: htmlDecode(this.cmsTitle) },
        { vmid: 'og:image', property: 'og:image', content: htmlDecode(this.cmsOgImage) }
      ]
    }
  }
}
