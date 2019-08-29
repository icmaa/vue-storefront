// title and description --> icmaa-cms/mixins/categoryExtras.ts

import { mapGetters } from 'vuex';
import { htmlDecode } from '@vue-storefront/core/filters';

export default {
  computed: {
    ...mapGetters('category', [
      'getCurrentCategory',
      'getCurrentCategoryProductQuery',
      'getAllCategoryFilters',
      'getCategoryBreadcrumbs',
      'getCurrentCategoryPath'
    ]),

    productName () {
      return this.product ? this.product.name : '';
    },
    productPrice () {
      return this.product ? this.product.price : '';
    },
    productBrandBand () {
      return this.product ? this.product.brand : this.product.band;
    }
  },
  metaInfo () {
    return {
      title: 'Placeholder - categorypage',
      meta: [
        {
          vmid: 'keywords',
          name: 'keywords',
          content: 'Placeholder - categorypageKeywords'
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
          content: htmlDecode(this.getCurrentCategory.url_path)
        },
        { vmid: 'og:type', property: 'og:type', content: 'product.group' }
      ]
    };
  }
};
