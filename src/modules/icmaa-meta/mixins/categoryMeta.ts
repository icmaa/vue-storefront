import { mapGetters } from 'vuex'

import config from 'config'
import { getThumbnailPath } from '@vue-storefront/core/helpers'
import { htmlDecode } from '@vue-storefront/core/filters'

export default {
  computed: {
    ...mapGetters({
      category: 'category-next/getCurrentCategory'
    }),
    metaTitle (): string {
      return this.category.meta_title || this.category.name
    },
    metaDescription (): string | boolean {
      return this.category.meta_description || false
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
    },
    currentRouteName () {
      return this.category?.isGenericSubcategory === true
        ? this.category?.subcategory.title : this.category?.name
    }
  },
  metaInfo () {
    const meta = [
      {
        vmid: 'og:title',
        property: 'og:title',
        content: htmlDecode(this.category.name)
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
