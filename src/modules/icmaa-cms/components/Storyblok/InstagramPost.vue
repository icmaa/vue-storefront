<template>
  <div>
    <blockquote class="instagram-media" :data-instgrm-captioned="showCaption" :data-instgrm-permalink="link" data-instgrm-version="14" />
  </div>
</template>

<script lang="ts">
import LoadSdkMixin from 'icmaa-cms/mixins/LoadSdk'

export default {
  name: 'InstagramPost',
  mixins: [LoadSdkMixin],
  props: {
    postId: {
      type: String,
      required: true
    },
    showCaption: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    link () {
      return `https://www.instagram.com/p/${this.postId}/?utm_source=ig_embed&amp;utm_campaign=loading`
    }
  },
  mounted () {
    this.loadSdkScript('//www.instagram.com/embed.js', 'instgrm')
  }
}
</script>

<style>
.instagram-media {
  background:#FFF;
  border:0;
  margin: 0 auto !important;
  max-width:540px;
  min-width:326px;
  padding:0;
  width:99.375%;
  width:-webkit-calc(100% - 2px);
  width:calc(100% - 2px);
}

</style>
