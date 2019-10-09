<template>
  <div id="teaser">
    <template v-if="showLarge && teaserLarge">
      <teaser-large :teaser="teaserLarge" />
    </template>
    <template v-if="teaserSmall && teaserSmall.length > 0">
      <teaser-small
        v-for="(teaser, index) in teaserSmall"
        :teaser="teaser"
        :key="'small_' + index"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import TeaserLarge from 'theme/components/core/blocks/Teaser/TeaserLarge';
import TeaserSmall from 'theme/components/core/blocks/Teaser/TeaserSmall';

export default {
  props: {
    tags: {
      type: String,
      required: true
    },
    showLarge: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 4
    }
  },
  components: {
    TeaserLarge,
    TeaserSmall
  },
  computed: {
    ...mapGetters('icmaaTeaser', ['getSmallTeaser', 'getLargeTeaser']),
    teaserLarge () {
      return this.getLargeTeaser[0]
    },
    teaserSmall () {
      const teaser = this.getSmallTeaser
      return teaser.slice(0, this.limit - 1)
    }
  },
  mounted () {
    this.$store.dispatch('icmaaTeaser/list', this.tags)
  }
}
</script>
