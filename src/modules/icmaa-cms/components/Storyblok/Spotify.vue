<template>
  <div>
    <Placeholder
      service="spotify"
      ratio="16:11"
      icon="spotify"
      icon-set="icmaa"
      class="t-mx-auto t-max-w-lg"
    >
      <iframe
        style="border-radius:12px"
        :src="src"
        width="100%"
        height="352"
        frameBorder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        class="t-mx-auto t-max-w-lg"
      />
    </Placeholder>
  </div>
</template>

<script lang="ts">
import Placeholder from 'icmaa-cms/components/Storyblok/UserCentricsPlaceholder.vue'

export default {
  name: 'Spotify',
  components: { Placeholder },
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: v => ['artist', 'track', 'playlist'].includes(v)
    }
  },
  computed: {
    src () {
      if (this.type === 'artist') {
        return `https://open.spotify.com/embed/artist/${this.id}?utm_source=generator&theme=0`
      } else if (this.type === 'playlist') {
        return `https://open.spotify.com/embed/playlist/${this.id}?utm_source=generator&theme=0`
      }

      return `https://open.spotify.com/embed/track/${this.id}?utm_source=generator&theme=0`
    }
  }
}
</script>
