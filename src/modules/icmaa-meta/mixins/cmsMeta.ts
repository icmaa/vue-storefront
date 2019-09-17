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
    }
  },
  metaInfo () {
    return {
      // title: htmlDecode(this.cmsTitle),
      meta: [
        { vmid: 'description', name: 'description', content: htmlDecode(this.cmsDescription) },
        { vmid: 'og:url', property: 'og:url', content: htmlDecode(this.cmsUrl) },
        { vmid: 'og:title', property: 'og:title', content: htmlDecode(this.cmsTitle) }
      ]
    }
  }
}
