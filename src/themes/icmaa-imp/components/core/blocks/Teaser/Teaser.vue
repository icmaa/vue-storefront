<template>
  <div id="teaser">
    <template v-if="showLarge">
      <TeaserLarge
        v-for="(teaser, index) in teaserLarge"
        :teaser="teaser"
        :key="index"
      />
    </template>
    <TeaserSmall
      v-for="(teaser, index) in teaserSmall"
      :teaser="teaser"
      :key="index"
    />
  </div>
</template>

<script>
import TeaserLarge from 'theme/components/core/blocks/Teaser/TeaserLarge';
import TeaserSmall from 'theme/components/core/blocks/Teaser/TeaserSmall';

import { mapGetters } from 'vuex';

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
    ...mapGetters('icmaaTeaser', ['getFilteredTeaser']),
    teaserLarge () {
      console.log(this.getFilteredTeaser({ size: 'large' }))
      return []
    },
    teaserSmall () {
      console.log(this.getFilteredTeaser({ size: 'small' }))
      return []
    }
  },
  mounted () {
    this.$store.dispatch('icmaaTeaser/list', this.tags)
  }
};
</script>
