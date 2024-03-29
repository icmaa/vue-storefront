<template>
  <div data-test-id="Teaser">
    <TeaserSkeleton
      v-if="loading"
      v-bind="{ isMobile, showLarge, showSplit, showSmallInRow }"
    />
    <template v-else>
      <template v-if="showLarge && teaserLarge">
        <TeaserFullsize
          :teaser="teaserLarge"
          :redirect-to-edit="redirectToEdit"
          :class="{ 't-mb-8': showSplit }"
        />
      </template>
      <template v-if="showSplit && teaserSmall && teaserSmall.length > 0">
        <template v-if="showSmallInRow">
          <div class="t--mb-8 t-flex t-flex-wrap">
            <TeaserSmall
              v-for="(teaser, index) in teaserSmall"
              :key="'small_' + teaser.storyId"
              :teaser="teaser"
              :index="index"
              :redirect-to-edit="redirectToEdit"
              class="t-mb-8"
            />
          </div>
        </template>
        <template v-else>
          <div class="t--mb-8">
            <TeaserSplit
              v-for="(teaser, index) in teaserSmall"
              :key="'small_' + teaser.storyId"
              :teaser="teaser"
              :index="index"
              :redirect-to-edit="redirectToEdit"
              class="t-mb-8"
            />
          </div>
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
  components: {
    TeaserSkeleton,
    TeaserFullsize,
    TeaserSplit,
    TeaserSmall
  },
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
  computed: {
    ...mapGetters({
      teaserByType: 'icmaaTeaser/getTeaserByType',
      viewport: 'ui/getViewport',
      getUserSessionData: 'user/getSessionData'
    }),
    teaserLarge () {
      return this.teaserByType({ size: 'large', tag: this.tags, cluster: this.customercluster, gender: this.gender })[0]
    },
    teaserSmall () {
      const teaser = this.teaserByType({ size: 'small', tag: this.tags, cluster: this.customercluster, gender: this.gender })
      return teaser.slice(0, this.TeaserSmallRow ? 4 : this.limit)
    },
    isMobile () {
      return !this.viewport || ['xs', 'sm'].includes(this.viewport)
    },
    size () {
      return !this.showLarge ? 'small' : this.showSplit ? undefined : 'large'
    },
    currentGender () {
      return this.gender || this.getUserSessionData('gender')
    },
    currentCluster () {
      return this.customercluster || this.getUserSessionData('cluster')
    }
  },
  watch: {
    tags () {
      this.fetchTeaser()
    },
    currentCluster () {
      this.fetchTeaser()
    },
    currentGender () {
      this.fetchTeaser()
    }
  },
  mounted () {
    this.fetchTeaser()
      .then(() => {
        this.loading = false
      })
  },
  methods: {
    async fetchTeaser () {
      const { tags, size, currentGender: gender, currentCluster: cluster } = this
      await this.$store.dispatch('icmaaTeaser/list', { tags, size, cluster, gender })
    }
  }
}
</script>
