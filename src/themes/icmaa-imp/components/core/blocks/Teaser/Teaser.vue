<template>
  <div id="teaser">
    <template v-if="showLarge && teaserLarge">
      <teaser-large :teaser="teaserLarge" class="t-mb-5 lg:t-my-5" />
    </template>
    <template v-if="teaserSmall && teaserSmall.length > 0">
      <teaser-small v-for="(teaser, index) in teaserSmall" :teaser="teaser" :index="index" :key="'small_' + index" class="t-mb-5" />
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
      return this.getLargeTeaser(this.tags)[0]
    },
    teaserSmall () {
      const teaser = this.getSmallTeaser(this.tags)
      return teaser.slice(0, this.limit - 1)
    }
  },
  mounted () {
    this.$store.dispatch('icmaaTeaser/list', this.tags)
  }
}
</script>
