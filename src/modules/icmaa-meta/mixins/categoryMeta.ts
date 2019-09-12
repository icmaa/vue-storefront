// title and description --> icmaa-cms/mixins/categoryExtras.ts
import { storeCode } from 'icmaa-meta/helper'
import { htmlDecode } from '@vue-storefront/core/filters'
import config from 'config'

export default {
  computed: {
    categoryUrl () {
      return (
        config.icmaa_meta.base_url + '/' + storeCode() + '/' + this.getCurrentCategory.url_path
      ); // TODO storecode "default"
    }
  },
  metaInfo () {
    return {
      meta: [
        {
          vmid: 'keywords',
          name: 'keywords',
          content: htmlDecode(this.getCurrentCategory.meta_keywords) // TODO Keywords from Magento or from categoryExtras?
        },
        {
          vmid: 'og:image',
          property: 'og:image',
          content: 'bild ...'
        }, // TODO multiple images..
        {
          vmid: 'og:title',
          property: 'og:title',
          content: htmlDecode(this.getCurrentCategory.name)
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: htmlDecode(this.categoryUrl)
        },
        { vmid: 'og:type', property: 'og:type', content: 'product.group' }
      ]
    };
  }
};
