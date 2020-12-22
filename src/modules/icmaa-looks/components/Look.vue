<template>
  <div class="t-flex t-wrap t-align-top t-bg-white">
    <div class="t-flex-fix">
      <picture-component :src="look.image" :width="imageWidth" :height="imageHeight" :sizes="imageSizes" :placeholder="true" :ratio="`${imageWidth}:${imageHeight}`" :alt="look.title | htmlDecode" />
    </div>
    <div class="t-flex-1 t-p-4 lg:t-p-8">
      <h2 class="t-text-2xl t-font-semibold">
        {{ look.title }}
        <span class="t-text-sm t-font-thin">by {{ look.modelName }}</span>
      </h2>
      <div>{{ look.created | date }}</div>
      <div>{{ look.description }}</div>
      <div class="t-flex t-flex-wrap t--mx-2">
        <product-tile v-for="(p, i) in products" :key="i" :product="p" class="product t-cursor-pointer t-px-1 lg:t-px-2 t-mb-8 t-w-1/2 lg:t-w-1/4 lg:t-mb-0" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import PictureComponent from 'theme/components/core/blocks/Picture'
import ProductTile from 'theme/components/core/ProductTile'

export default {
  name: 'Look',
  props: {
    look: {
      type: Object,
      required: true
    }
  },
  components: {
    PictureComponent,
    ProductTile
  },
  computed: {
    ...mapGetters({ getProducts: 'icmaaLooks/getProducts' }),
    imageWidth () {
      return 360
    },
    imageHeight () {
      return 500
    },
    imageSizes () {
      return [
        { media: '(min-width: 1280px)', width: 360 },
        { media: '(min-width: 1024px)', width: 236 },
        { media: '(min-width: 415px)', width: 364 },
        { media: '(max-width: 414px)', width: 188 }
      ]
    },
    products () {
      return this.getProducts(this.look.products)
    }
  },
  methods: {
    async loadProducts (identifier) {
      return this.$store.dispatch('icmaaLooks/getLookProducts', identifier)
    }
  },
  created () {
    this.$store.dispatch('icmaaLooks/getLookProducts', this.look.products)
  }
}
</script>
