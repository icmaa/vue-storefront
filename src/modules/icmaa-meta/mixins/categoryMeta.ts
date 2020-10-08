import { mapGetters } from 'vuex'

import config from 'config'
import { getThumbnailPath } from '@vue-storefront/core/helpers'
import { htmlDecode } from '@vue-storefront/core/filters'

export default {
  computed: {
    ...mapGetters('category-next', ['getCurrentCategory']),
    ...mapGetters({ categoryExtras: 'icmaaCategoryExtras/getCategoryExtrasByCurrentCategory' }),
    metaTitle (): string {
      return this.categoryExtras && this.categoryExtras['metaTitle']
        ? this.categoryExtras['metaTitle'] : this.getCurrentCategory['name']
    },
    metaDescription (): string | boolean {
      return this.categoryExtras && this.categoryExtras.metaDescription
        ? this.categoryExtras.metaDescription : false
    },
    categoryFBImages () {
      if (!this.getCategoryProducts) {
        return []
      }

      let categoryImagesTags = []
      let limit = Math.min(this.getCategoryProducts.length, config.icmaa_meta.facebook.imagesListInCategoryView)

      this.getCategoryProducts.slice(0, limit).forEach(image => {
        categoryImagesTags.push({
          property: 'og:image',
          content: getThumbnailPath('/catalog/product' + image.image, this.width, this.height, 'media')
        })
      })

      return categoryImagesTags
    }
  },
  metaInfo () {
    let meta = [
      {
        vmid: 'og:title',
        property: 'og:title',
        content: htmlDecode(this.getCurrentCategory.name)
      },
      { vmid: 'og:type', property: 'og:type', content: 'product.group' },
      ...this.categoryFBImages
    ]

    if (this.metaDescription) {
      meta.push({ vmid: 'description', name: 'description', content: htmlDecode(this.metaDescription) })
    }

    return {
      title: htmlDecode(this.metaTitle),
      meta
    }
  }
}
