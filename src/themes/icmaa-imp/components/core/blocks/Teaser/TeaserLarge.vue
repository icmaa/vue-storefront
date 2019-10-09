<template>
  <div id="teaser-large" class="md:t-mx-4 t-mb-5">
    <a :href="teaser.imageLink" class="">
      <div class="t-relative">
        <picture>
          <source
            media="(max-width: 767px)"
            :srcset="imageUrl1x1"
          >
          <source
            media="(min-width: 768px)"
            :srcset="imageUrl2x1"
          >
          <img
            class="t-w-full"
            :src="imageUrl1x1"
            alt=""
          >
        </picture>

        <div
          class="t-flex t-justify-center t-absolute t-bottom-0 t-inset-x-0 t-mb-6 t-text-sm t-text-small"
          :style="{ color: teaser.textColor }"
        >
          {{ teaser.text1 }}
          <material-icon icon="arrow_forward" class="t-ml-3" />
        </div>
      </div>
    </a>
  </div>
</template>

<script>
import { getThumbnailPath } from '@vue-storefront/core/helpers'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  components: {
    MaterialIcon
  },
  props: {
    teaser: {
      type: Object,
      required: true
    }
  },
  computed: {
    imageUrl1x1 () {
      return getThumbnailPath('/' + this.teaser['imageUrl1X1'], 0, 0, 'media')
    },
    imageUrl2x1 () {
      return getThumbnailPath('/' + this.teaser['imageUrl2X1'], 0, 0, 'media')
    }
  }
};
</script>
