<template>
  <div data-test-id="Teaser">
    <teaser-skeleton v-if="loading" v-bind="{ isMobile, showLarge, showSplit, showSmallInRow }" />
    <template v-else>
      <template v-if="showLarge && teaserLarge">
        <teaser-fullsize :teaser="teaserLarge" :redirect-to-edit="redirectToEdit" :class="{ 't-mb-8': showSplit }" />
      </template>
      <template v-if="showSplit && teaserSmall && teaserSmall.length > 0">
        <template v-if="showSmallInRow">
          <div class="t-flex t-flex-wrap">
            <teaser-small v-for="(teaser, index) in teaserSmall" :teaser="teaser" :index="index" :redirect-to-edit="redirectToEdit" :key="'small_' + teaser.storyId" />
          </div>
        </template>
        <template v-else>
          <teaser-split v-for="(teaser, index) in teaserSmall" :teaser="teaser" :index="index" :redirect-to-edit="redirectToEdit" :key="'small_' + teaser.storyId" :class="{ 't-mb-8': index !== (teaserSmall.length - 1) }" />
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import TeaserSkeleton from 'theme/components/core/blocks/Teaser/TeaserSkeleton'
import TeaserFullsize from 'theme/components/core/blocks/Teaser/TeaserFullsize'
import TeaserSplit from 'theme/components/core/blocks/Teaser/TeaserSplit'
import TeaserSmall from 'theme/components/core/blocks/Teaser/TeaserSmall'

export default {
  name: 'Teaser',
  props: {
    tags: {
      type: String,
      required: true
    },
    customercluster: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    gender: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    showLarge: {
      type: Boolean,
      default: true
    },
    showSplit: {
      type: Boolean,
      default: true
    },
    showSmallInRow: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 4
    },
    redirectToEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: true
    }
  },
  components: {
    TeaserSkeleton,
    TeaserFullsize,
    TeaserSplit,
    TeaserSmall
  },
  computed: {
    ...mapGetters({
      teaserByType: 'icmaaTeaser/getTeaserByType',
      viewport: 'ui/getViewport'
    }),
    teaserLarge () {
      return this.teaserByType({ size: 'large', tag: this.tags, cluster: this.customercluster, gender: this.gender })[0]
    },
    teaserSmall () {
      const teaser = this.teaserByType({ size: 'small', tag: this.tags, cluster: this.customercluster, gender: this.gender })
      return teaser.slice(0, this.TeaserSmallRow ? 4 : this.limit)
    },
    isMobile () {
      return ['xs', 'sm'].includes(this.viewport)
    },
    size () {
      return !this.showLarge ? 'small' : this.showSplit ? undefined : 'large'
    }
  },
  mounted () {
    this.$store.dispatch('icmaaTeaser/list', { tags: this.tags, size: this.size })
      .then(() => {
        this.loading = false
      })
  }
}
</script>
