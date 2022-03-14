<template>
  <div id="home" class="t-container">
    <teaser tags="2" :show-split="false" class="sm:t-pt-4 t-pb-8" />
    <link-list :title="topCategories.title" :items="topCategories.items" class="t-pb-4" />
    <teaser tags="21" :show-large="false" :show-small-in-row="true" class="t-pb-8" />
    <teaser tags="2" :show-large="false" :limit="3" class="t-pb-8" />
    <teaser tags="20" :show-large="false" :show-small-in-row="true" class="t-pb-8" />
    <lazyload data-test-id="LogoLineBlockLoader">
      <div class="t-flex t-flex-wrap t-px-4 t--mx-4 t-pb-4">
        <logo-line :parent-id="16" path="/merchandise" :title="'Bands'" class="t-mb-4 lg:t-mb-0" />
        <logo-line :parent-id="4681" path="/fashion" :title="'Brands'" />
      </div>
    </lazyload>
    <lazyload data-test-id="ProductListingWidgetLoader">
      <product-listing-widget :category-id="3278" />
    </lazyload>
    <lazyload data-test-id="ProductListingWidgetLoader">
      <product-listing-widget :category-id="4251" />
    </lazyload>
    <cms-block identifier="home-seo" class="t-mb-8 t-px-4 t-text-sm" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Lazyload from 'icmaa-cms/components/Lazyload'
import Teaser from 'theme/components/core/blocks/Teaser/Teaser'
import LinkList from 'theme/components/core/blocks/CategoryExtras/LinkList'
import LogoLine from 'theme/components/core/blocks/CategoryExtras/LogoLineBlock'
import ProductListingWidget from 'icmaa-category/components/ProductListingWidget'
import CmsBlock from 'icmaa-cms/components/Block'

export default {
  components: {
    Lazyload,
    Teaser,
    LinkList,
    LogoLine,
    ProductListingWidget,
    CmsBlock
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      getJsonBlockByIdentifier: 'icmaaCmsBlock/getJsonBlockByIdentifier'
    }),
    topCategories () {
      return this.getJsonBlockByIdentifier('home-top-categories')
    }
  },
  mounted () {
    if (!this.isLoggedIn && localStorage.getItem('redirect')) {
      this.$store.dispatch('ui/showModal', 'modal-signup')
    }

    const { fwd } = this.$route.query
    if (fwd) {
      if (fwd === 'login' && !this.isLoggedIn) {
        this.$store.commit('ui/setAuthElem', 'login')
        this.$store.dispatch('ui/showModal', 'modal-signup')
      } else if ((fwd === 'create' || fwd === 'register') && !this.isLoggedIn) {
        this.$store.commit('ui/setAuthElem', 'register')
        this.$store.dispatch('ui/showModal', 'modal-signup')
      } else if (fwd === 'cart') {
        this.$store.dispatch('ui/setSidebar', { key: 'microcart' })
      }

      this.$router.push(this.localizedHomeRoute)
    }
  },
  async asyncData ({ store, context }) {
    if (context) {
      context.output.cacheTags
        .add('home')
        .add('cms')
    }

    await store.dispatch('icmaaCmsBlock/list', 'home-seo,home-top-categories')
  }
}
</script>
