// title and description --> icmaa-cms/mixins/categoryExtras.ts
import { storeCode } from 'icmaa-meta/helper';
import { htmlDecode } from '@vue-storefront/core/filters'
import config from 'config'
import { mapGetters } from 'vuex';
import { getThumbnailPath } from '@vue-storefront/core/helpers';

export default {
  computed: {
    // ...mapGetters('catalog-next', ['getCategoryProducts']),
    ...mapGetters({
      getCurrentSearchQuery: 'category-next/getCurrentSearchQuery',
      getCategoryProducts: 'category-next/getCategoryProducts',
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCategoryProductsTotal: 'category-next/getCategoryProductsTotal',
      getAvailableFilters: 'category-next/getAvailableFilters'
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
      let categoryImagesTags = [];
      // let limit = config.facebook.opengraph.imagesListInCategoryView

      this.getCategoryProducts.slice(0, 4).forEach(image => {
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
