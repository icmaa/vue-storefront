<template :class="content.backgroundcolor">
  <div class="t-container">
    <!-- Video -->
    <div class="t-relative t-w-full t-bg-white t-mb-4" style="padding-top: 56.25%">
      <iframe class="t-absolute t-top-0" width="100%" height="100%" :src="videoLink" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen/>
    </div>

    <!-- Button -->
    <div v-if="buttonLink" class="t-flex t-justify-center t-mb-4">
      <a :href="buttonLink">
        <button-component type="primary" size="md" class="t-w-full t-block t-text-white t-px-4 t-py-2">
          {{ buttonText }}
        </button-component>
      </a>
    </div>

    <!-- SEO text-->
    <div class="t-w-full t-px-4 t-mb-4">
      <p>{{ seoText }}</p>
    </div>

    <!-- Products -->
    <lazy-hydrate when-visible>
      <product-listing-widget :category-id="content.products.category" :limit="content.products.limit" />
    </lazy-hydrate>
  </div>
</template>

<script>
import ButtonComponent from 'theme/components/core/blocks/Button'
import LazyHydrate from 'vue-lazy-hydration'
import Page from 'icmaa-cms/mixins/Page'
import ProductListingWidget from 'icmaa-category/components/core/ProductListingWidget'

import { mapGetters } from 'vuex'

export default {
  name: 'DigitalEvent',
  mixins: [ Page ],
  components: {
    ButtonComponent,
    ProductListingWidget,
    LazyHydrate
  },
  data () {
    return {
      dataType: 'yaml'
    }
  },
  computed: {
    videoLink () {
      return this.content.video.link
    },
    seoText () {
      return this.content.seo_text || ''
    },
    buttonText () {
      return this.content.button.text || ''
    },
    buttonLink () {
      return this.content.button.link || ''
    }
  }
}
</script>
