<template>
  <div>
    <div v-for="look in looks" :key="look.uid">
      <h1>{{ look.title }}</h1>
      <div>{{ look.created | date }}</div>
      <div>{{ look.description }}</div>
      <div>{{ look.modelName }}</div>
      <div>
        <picture-component :src="look.image" :width="imageWidth" :height="imageHeight" :sizes="imageSizes" :placeholder="true" :ratio="`${imageWidth}:${imageHeight}`" :alt="look.title | htmlDecode" />
      </div>
      <div>{{ look.products }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import PictureComponent from 'theme/components/core/blocks/Picture'

export default {
  name: 'Looks',
  components: {
    PictureComponent
  },
  computed: {
    ...mapGetters({ looks: 'icmaaLooks/getLooks' }),
    imageWidth () {
      return 200
    },
    imageHeight () {
      return 400
    },
    imageSizes () {
      return []
    }
  },
  created () {
    this.$store.dispatch('icmaaLooks/list', {})
  }
}
</script>
