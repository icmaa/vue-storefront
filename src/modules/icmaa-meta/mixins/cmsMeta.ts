import { storeCode } from 'icmaa-meta/helper'
import { htmlDecode } from '@vue-storefront/core/filters'
import config from 'config'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('icmaaCmsPage', ['getPages']),
    cmsTitle () {
      return this.getPages.identifier ? this.getPages.identifier : '';
    },
    cmsUrl () {
      return config.icmaa_meta.base_url + '/' + storeCode() + '/' + this.getPages.identifier; // TODO storecode "default"
    },
    cmsDescription () {
      return this.getPages.identifier ? this.getPages.identifier : '';
    }
  },
  metaInfo () {
    return {
      title: 'htmlDecode(this.cmsTitle)',
      meta: [
        { vmid: 'description', name: 'description', content: 'htmlDecode(this.cmsDescription)' },
        { vmid: 'og:url', property: 'og:url', content: 'test' },
        { vmid: 'og:title', property: 'og:title', content: 'htmlDecode(this.cmsTitle)' }
      ]
    }
  }
}
