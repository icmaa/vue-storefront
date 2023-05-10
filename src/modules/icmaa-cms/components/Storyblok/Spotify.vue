<template>
  <div>
    <iframe style="border-radius:12px" :src="src" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Spotify',
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: v => ['artist', 'track'].includes(v)
    }
  },
  computed: {
    src () {
      if (this.type === 'artist') {
        return `https://open.spotify.com/embed/artist/${this.id}?utm_source=generator&theme=0`
      }
      return `https://open.spotify.com/embed/track/${this.id}?utm_source=generator&theme=0`
    }
  }
}
</script>
