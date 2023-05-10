<template>
  <div />
</template>

<script lang="ts">
import LoadSdkMixin from 'icmaa-cms/mixins/LoadSdk'

export default {
  name: 'Twitter',
  mixins: [LoadSdkMixin],
  props: {
    url: {
      type: String,
      required: true
    }
  },
  computed: {
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
    getFromUrl (url: string, key: 'screenName' | 'sourceType' | 'id'): string | boolean {
      const regex = /twitter\.com\/(?<screenName>[\w\-_]+)(\/(?<sourceType>\w+)\/(?<id>\d+))*/
      const result = regex.exec(url)
      return result?.groups[key] || false
    }
  },
  mounted () {
    this.loadSdkScript('//platform.twitter.com/widgets.js', 'twttr')
      .then(() => {
        switch (this.sourceType) {
          case 'status':
            (window as any).twttr.widgets.createTweet(
              this.id,
              this.$el,
              { conversation: 'none', align: 'center' }
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
                chrome: 'nofooter'
              }
            )
            break
        }
      })
  }
}
</script>
