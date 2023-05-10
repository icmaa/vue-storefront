<template>
  <div>
    <iframe class="youtube-video" :src="src" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen />
  </div>
</template>

<script lang="ts">
export default {
  name: 'YouTube',
  props: {
    id: {
      type: String,
      required: true
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
