// title and description --> icmaa-cms/mixins/categoryExtras.ts
import { storeCode } from 'icmaa-meta/helper';
import { htmlDecode } from '@vue-storefront/core/filters'
import config from 'config'
import { mapGetters } from 'vuex';
import { getThumbnailPath } from '@vue-storefront/core/helpers';

export default {
  computed: {
    ...mapGetters({
      getCategoryProducts: 'category-next/getCategoryProducts'
    }),
    categoryUrl () {
      return (
        config.icmaa_meta.base_url +
        '/' +
        storeCode() +
        '/' +
        this.getCurrentCategory.url_path
      ); // TODO storecode "default"
    },
    categoryFBImages () {
      if (!this.getCategoryProducts) {
        return [];
      }
      let categoryImagesTags = [];
      let limit = Math.min(this.getCategoryProducts.length, config.icmaa_meta.facebook.imagesListInCategoryView);

      this.getCategoryProducts.slice(0, limit).forEach(image => {
        categoryImagesTags.push({
          property: 'og:image',
          content: getThumbnailPath(
            '/catalog/product' + image.image,
            this.width,
            this.height,
            'media'
          )
        });
      });

      return categoryImagesTags;
    }
  },
  metaInfo () {
    return {
      meta: [
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
        { vmid: 'og:type', property: 'og:type', content: 'product.group' },
        ...this.categoryFBImages
      ]
    };
  }
};
