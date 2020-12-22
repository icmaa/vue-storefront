<template>
  <div class="t--mx-2 t-flex t-flex-wrap">
    <div v-for="look in looks" :key="look.uid" class="t-w-1/2 md:t-w-1/4 t-px-2 t-mb-4">
      <router-link :to="localizedRoute({ name: 'icmaa-looks-detail', params: { identifier: look.identifier }})" :title="look.title | htmlDecode">
        <picture-component :src="look.image" :width="imageWidth" :height="imageHeight" :sizes="imageSizes" :placeholder="true" :ratio="`${imageWidth}:${imageHeight}`" :alt="look.title | htmlDecode" />
      </router-link>
    </div>
  </div>
</template>

<script>
import config from 'config'
import { mapGetters } from 'vuex'

import PictureComponent from 'theme/components/core/blocks/Picture'

export default {
  name: 'LookList',
  props: {
    looks: {
      type: [Array],
      required: true
    }
  },
  components: {
    PictureComponent
  },
  computed: {
    imageWidth () {
      return config.products.thumbnails.width
    },
    imageHeight () {
      return config.products.thumbnails.height
    },
    imageSizes () {
      return [
        { media: '(min-width: 1280px)', width: 360 },
        { media: '(min-width: 1024px)', width: 236 },
        { media: '(min-width: 415px)', width: 364 },
        { media: '(max-width: 414px)', width: 188 }
      ]
    }
  }
}
</script>
