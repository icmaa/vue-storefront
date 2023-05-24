<template>
  <div v-if="isVisible">
    <router-link
      v-if="link"
      :to="localizedRoute(link)"
      :title="category.name"
      class="t-block"
    >
      <PictureComponent
        :alt="category.name | stripHTML"
        :src="banner"
        :width="624"
        :height="172"
        :placeholder="true"
        :sizes="sizes"
        ratio="1:1"
        class="t-w-screen"
      />
    </router-link>
    <PictureComponent
      v-else
      :alt="category.name | stripHTML"
      :src="banner"
      :width="624"
      :height="172"
      :placeholder="true"
      :sizes="sizes"
      ratio="1:1"
      class="t-w-screen"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PictureComponent from 'theme/components/core/blocks/Picture'

import { isDatetimeInBetween } from 'icmaa-config/helpers/datetime'

export default {
  name: 'CategoryExtrasListBanner',
  components: {
    PictureComponent
  },
  computed: {
    ...mapGetters({
      category: 'category-next/getCurrentCategory',
      categoryExtras: 'icmaaCategoryExtras/getCategoryExtrasByCurrentCategory'
    }),
    isVisible () {
      if (!this.categoryExtras) {
        return false
      }

      const { listBannerShowFrom, listBannerShowTo, active } = this.categoryExtras
      return active && this.banner &&
        isDatetimeInBetween(listBannerShowFrom, listBannerShowTo)
    },
    banner () {
      if (!this.categoryExtras.listBannerImage) {
        return false
      }

      return this.categoryExtras.listBannerImage
    },
    link () {
      return !this.categoryExtras.listBannerLink ? false : this.categoryExtras.listBannerLink
    },
    sizes () {
      return [
        // Order high-to-low is important
        { media: 'xl', width: 1280 },
        { media: 'lg', width: 992 },
        { media: 'sm', width: 736 },
        { media: 'xs', width: 640 },
        { width: 415 }
      ]
    }
  }
}
</script>
