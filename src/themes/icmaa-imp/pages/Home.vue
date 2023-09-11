<template>
  <div
    id="home"
    class="t-container"
  >
    <Teaser
      tags="2"
      :show-split="false"
      class="t-pb-8 t-pt-4 md:t-pt-8"
    />
    <Teaser
      tags="21"
      :show-large="false"
      :show-small-in-row="true"
      class="t-pb-8"
    />
    <LinkList
      :title="topCategories.title"
      :items="topCategories.items"
      class="t-pb-4"
    />
    <Teaser
      tags="2"
      :show-large="false"
      :limit="3"
      class="t-pb-8"
    />
    <Teaser
      tags="20"
      :show-large="false"
      :show-small-in-row="true"
      class="t-pb-8"
    />
    <Lazyload data-test-id="ProductListingWidgetLoader">
      <Recommendations
        key="recently-viewed"
        :title="$t('Recently viewed')"
        event-type="home-page-view"
        serving-configs="recently_viewed_default"
        class="t-px-4 lg:t-mb-8"
      />
    </Lazyload>
    <Lazyload data-test-id="LogoLineBlockLoader">
      <div class="t--mx-4 t-flex t-flex-wrap t-px-4 t-pb-4">
        <LogoLine
          v-for="({ path, title, logos }, i) in logolines"
          :key="path"
          :path="path"
          :title="title"
          :items="logos"
          :class="{ 't-mb-4 lg:t-mb-0': i < logolines.length - 1 }"
        />
      </div>
    </Lazyload>
    <Lazyload data-test-id="BlogWidgetLoader">
      <BlogList
        :is-root="true"
        :query="{ firstPublishedAt: { gte: blogFromDate } }"
        class="t-px-4"
      />
    </Lazyload>
    <Lazyload data-test-id="ProductListingWidgetLoader">
      <Recommendations
        key="recommended-for-you"
        :title="$t('Recommended for you')"
        event-type="home-page-view"
        serving-configs="recommended-for-you"
        class="t-px-4 lg:t-mb-8"
      />
    </Lazyload>
    <CmsBlock
      identifier="home-seo"
      class="t-mb-8 t-px-4 t-text-sm"
    />
  </div>
</template>

<script>
import config from 'config'
import { mapGetters } from 'vuex'
import { getCurrentStoreviewDayjsDatetime, intDateFormat } from 'icmaa-config/helpers/datetime'
import Lazyload from 'icmaa-cms/components/Lazyload'
import Teaser from 'theme/components/core/blocks/Teaser/Teaser'
import LinkList from 'theme/components/core/blocks/CategoryExtras/LinkList'
import LogoLine from 'theme/components/core/blocks/CategoryExtras/LogoLineBlock'
import Recommendations from 'icmaa-recommendations/components/Recommendations'
import CmsBlock from 'icmaa-cms/components/Block'
import BlogList from 'icmaa-blog/components/ListWrapper'

import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'

export default {
  components: {
    Lazyload,
    Teaser,
    LinkList,
    LogoLine,
    Recommendations,
    CmsBlock,
    BlogList
  },
  async asyncData ({ store, context }) {
    if (context) {
      context.output.cacheTags
        .add('home')
        .add('cms')
    }

    await store.dispatch('icmaaCmsBlock/list', 'home-top-categories,home-logos,home-seo')
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      cluster: 'user/getCluster',
      getJsonBlockByIdentifier: 'icmaaCmsBlock/getJsonBlockByIdentifier'
    }),
    topCategories () {
      return this.getJsonBlockByIdentifier('home-top-categories')
    },
    logolines () {
      const noClusterValue = config.icmaa.user.noClusterValue
      const logolines = this.getJsonBlockByIdentifier('home-logos')
      return logolines.map(line => {
        const logos = line.logos.filter(l => {
          const cluster = l.cluster?.map(l => l.toString()) || []
          if (cluster.length === 0 || (!this.cluster && cluster.includes(noClusterValue))) {
            return true
          }
          return cluster.includes(this.cluster)
        })

        return Object.assign(line, { logos })
      })
    },
    blogFromDate () {
      return getCurrentStoreviewDayjsDatetime()
        .subtract(2, 'month')
        .format(intDateFormat)
    }
  },
  mounted () {
    IcmaaGoogleTagManagerExecutors.homeVisited()

    if (!this.isLoggedIn && localStorage.getItem('redirect')) {
      this.$store.dispatch('ui/showModal', 'modal-signup')
    }

    const { fwd, redirect } = this.$route.query
    if (fwd) {
      if (fwd === 'login' && !this.isLoggedIn) {
        const redirectRoute = redirect ? { path: redirect } : undefined
        this.$store.commit('ui/setAuthElem', 'login')
        this.$store.commit('ui/setAuthRedirect', redirectRoute)
        this.$store.dispatch('ui/showModal', 'modal-signup')
      } else if ((fwd === 'create' || fwd === 'register') && !this.isLoggedIn) {
        this.$store.commit('ui/setAuthElem', 'register')
        this.$store.dispatch('ui/showModal', 'modal-signup')
      } else if (fwd === 'cart') {
        this.$store.dispatch('ui/setSidebar', { key: 'microcart' })
      }

      this.$router.push(this.localizedHomeRoute)
    }
  }
}
</script>
