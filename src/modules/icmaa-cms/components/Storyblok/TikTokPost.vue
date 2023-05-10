<template>
  <div>
    <blockquote class="tiktok-embed" :cite="postUrl" :data-video-id="videoId">
      <section />
    </blockquote>
  </div>
</template>

<script lang="ts">
import LoadSdkMixin from 'icmaa-cms/mixins/LoadSdk'

export default {
  name: 'TikTokPost',
  mixins: [LoadSdkMixin],
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
    }
  },
  mounted () {
    this.loadSdkScript('//www.tiktok.com/embed.js', 'tiktokEmbed')
  }
}
</script>

<style>
.tiktok-embed {
  max-width: 605px;
  min-width: 325px;
}
</style>
