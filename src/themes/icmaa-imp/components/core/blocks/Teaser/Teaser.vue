<template>
  <div id="teaser">
    <template v-if="showLarge">
      <TeaserLarge
        v-for="(teaser, index) in teaserLarge"
        :teaser="teaser"
        :key="'large_' + index"
      />
    </template>
    <TeaserSmall
      v-for="(teaser, index) in teaserSmall"
      :teaser="teaser"
      :key="'small_' + index"
    />
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
    ...mapGetters('icmaaTeaser', { teaserSmall: 'getSmallTeaser', teaserLarge: 'getLargeTeaser' })
  },
  mounted () {
    this.$store.dispatch('icmaaTeaser/list', this.tags)
  }
};
</script>
