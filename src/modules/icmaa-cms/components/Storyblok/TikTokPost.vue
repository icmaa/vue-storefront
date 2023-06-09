<template>
  <Placeholder
    service="tik-tok"
    :script="script"
    ratio="128:185"
    icon="tiktok"
    icon-set="icmaa"
    class="t-mx-auto t-max-w-lg"
  >
    <div class="t-mx-auto t-my-0 t-max-w-lg">
      <blockquote
        class="tiktok-embed !t-my-0"
        :cite="postUrl"
        :data-video-id="videoId"
      >
        <section />
      </blockquote>
    </div>
  </Placeholder>
</template>

<script lang="ts">
import Placeholder from 'icmaa-cms/components/Storyblok/UserCentricsPlaceholder.vue'

export default {
  name: 'TikTokPost',
  components: { Placeholder },
  props: {
    postUrl: {
      type: String,
      required: true
    }
  },
  computed: {
    videoId () {
      const regex = /\/video\/(\d+)/
      const result = regex.exec(this.postUrl)
      return result ? result[1] : ''
    },
    script () {
      return {
        src: '//www.tiktok.com/embed.js',
        id: 'tiktokEmbed'
      }
    }
  }
}
</script>
