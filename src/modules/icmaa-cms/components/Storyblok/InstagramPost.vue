<template>
  <div class="t-mx-auto t-max-w-lg">
    <Placeholder
      service="instagram-content"
      :script="script"
      ratio="127:201"
      icon="instagram"
      icon-set="icmaa"
    >
      <blockquote
        class="instagram-media"
        :data-instgrm-captioned="showCaption"
        :data-instgrm-permalink="link"
        data-instgrm-version="14"
      />
    </Placeholder>
  </div>
</template>

<script lang="ts">
import Placeholder from 'icmaa-cms/components/Storyblok/UserCentricsPlaceholder.vue'

export default {
  name: 'InstagramPost',
  components: { Placeholder },
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
    },
    script () {
      return {
        src: '//www.instagram.com/embed.js',
        id: 'instgrm'
      }
    }
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
  width:calc(100% - 2px);
}

</style>
