<template>
  <Placeholder
    service="twitter-plugin"
    :script="script"
    ratio="32:25"
    icon="twitter"
    icon-set="icmaa"
    class="t-mx-auto t-max-w-lg"
    @script-loaded="afterScriptLoaded"
  >
    <div class="twitter t-mx-auto t-max-w-lg" />
  </Placeholder>
</template>

<script lang="ts">
import Placeholder from 'icmaa-cms/components/Storyblok/UserCentricsPlaceholder.vue'

export default {
  name: 'Twitter',
  components: { Placeholder },
  props: {
    url: {
      type: String,
      required: true
    }
  },
  computed: {
    script () {
      return {
        src: '//platform.twitter.com/widgets.js',
        id: 'twttr'
      }
    },
    screenName () {
      return this.getFromUrl(this.url, 'screenName')
    },
    sourceType () {
      return this.getFromUrl(this.url, 'sourceType') || 'profile'
    },
    id () {
      return this.getFromUrl(this.url, 'id')
    }
  },
  methods: {
    afterScriptLoaded () {
      switch (this.sourceType) {
        case 'status':
          (window as any).twttr.widgets.createTweet(
            this.id,
            this.$el,
            { conversation: 'none', align: 'center', dnt: true }
          )
          break

        case 'profile':
          (window as any).twttr.widgets.createTimeline(
            {
              sourceType: this.sourceType,
              screenName: this.screenName
            },
            this.$el,
            {
              height: 400,
              tweetLimit: 3,
              chrome: 'nofooter',
              dnt: true
            }
          )
          break
      }
    },
    getFromUrl (url: string, key: 'screenName' | 'sourceType' | 'id'): string | boolean {
      const regex = /twitter\.com\/(?<screenName>[\w\-_]+)(\/(?<sourceType>\w+)\/(?<id>\d+))*/
      const result = regex.exec(url)
      return result?.groups[key] || false
    }
  }
}
</script>

<style lang="scss" scoped>

div::v-deep .twitter-tweet,
div::v-deep .twitter-timeline {
  margin: 0 auto !important;
}
</style>
