<template>
  <div id="home" class="t-container">
    <teaser tags="2" :show-split="false" class="sm:t-pt-4 t-pb-8" />
    <teaser tags="21" :show-large="false" :show-small-in-row="true" class="t-pb-8" />
    <teaser tags="2" :show-large="false" :limit="3" class="t-pb-8" />
    <teaser tags="20" :show-large="false" :show-small-in-row="true" class="t-pb-8" />
    <lazyload>
      <div class="t-flex t-flex-wrap t-px-4 t--mx-4 t-pb-4">
        <logo-line :parent-id="16" path="/merchandise" :title="'Bands'" class="t-mb-4 lg:t-mb-0" />
        <logo-line :parent-id="4681" path="/fashion" :title="'Brands'" />
      </div>
    </lazyload>
    <lazyload>
      <product-listing-widget :category-id="3278" />
    </lazyload>
    <lazyload>
      <product-listing-widget :category-id="4251" />
    </lazyload>
    <cms-block identifier="home-seo" class="t-mb-8 t-px-4 t-text-sm" />
  </div>
</template>

<script>
import { currentStoreView, localizedRoute } from '@vue-storefront/core/lib/multistore'

import Lazyload from 'icmaa-cms/components/Lazyload'
import Teaser from 'theme/components/core/blocks/Teaser/Teaser'
import LogoLine from 'theme/components/core/blocks/CategoryExtras/LogoLineBlock'
import ProductListingWidget from 'icmaa-category/components/ProductListingWidget'
import CmsBlock from 'icmaa-cms/components/Block'

export default {
  components: {
    Lazyload,
    Teaser,
    LogoLine,
    ProductListingWidget,
    CmsBlock
  },
  mounted () {
    if (!this.isLoggedIn && localStorage.getItem('redirect')) {
      this.$store.dispatch('ui/showModal', 'modal-signup')
    }

    const { fwd } = this.$route.query
    if (fwd) {
      if (fwd === 'login') {
        this.$store.commit('ui/setAuthElem', 'login')
        this.$store.dispatch('ui/showModal', 'modal-signup')
      } else if (fwd === 'create' || fwd === 'register') {
        this.$store.commit('ui/setAuthElem', 'register')
        this.$store.dispatch('ui/showModal', 'modal-signup')
      } else if (fwd === 'cart') {
        this.$store.dispatch('ui/setSidebar', { key: 'microcart' })
      }

      this.$router.push(localizedRoute('/', currentStoreView().storeCode))
    }
  },
  async asyncData ({ context }) {
    if (context) {
      context.output.cacheTags
        .add('home')
        .add('cms')
    }
  }
}
</script>
