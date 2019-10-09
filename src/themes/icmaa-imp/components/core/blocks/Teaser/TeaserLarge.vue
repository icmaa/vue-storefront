<template>
  <div id="teaser-large" class="md:t-mx-4 t-mb-5">
    <a :href="teaser.imageLink" class="">
      <div class="t-relative">
        <retina-image :image="imageUrl" class="t-w-full" />
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
import RetinaImage from 'theme/components/core/blocks/RetinaImage'

export default {
  components: {
    MaterialIcon,
    RetinaImage
  },
  props: {
    teaser: {
      type: Object,
      required: true
    }
  },
  computed: {
    imageUrl () {
      return getThumbnailPath('/' + this.teaser['imageUrl'], 0, 0, 'media')
    }
  }
};
</script>
