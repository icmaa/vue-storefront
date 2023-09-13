<template>
  <div>
    <Placeholder
      service="you-tube-video"
      ratio="16:9"
      icon="youtube"
      icon-set="icmaa"
      class="t-mx-auto"
      :class="{'t-max-w-lg': !size }"
    >
      <iframe
        class="youtube-video t-mx-auto"
        :class="{ 't-max-w-lg': !size }"
        :src="src"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
    </Placeholder>
  </div>
</template>

<script lang="ts">
import Placeholder from 'icmaa-cms/components/Storyblok/UserCentricsPlaceholder.vue'

export default {
  name: 'YouTube1',
  components: { Placeholder },
  props: {
    id: {
      type: String,
      required: true
    },
    size: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    src () {
      return `https://www.youtube-nocookie.com/embed/${this.id}?controls=0`
    }
  }
}
</script>

<style lang="scss">
.youtube-video {
  aspect-ratio: 16 / 9;
  width: 100%;
}
</style>
