<template>
  <div class="t-flex t-flex-wrap t-items-start t--mx-2">
    <div class="t-w-full md:t-w-1/3 t-px-2 t-mb-4">
      <div class="t-bg-white">
        <div class="t-p-4">
          <div class="t-font-light t-text-base-light t-text-xs t-mt-2 t-mb-3">
            {{ look.created | date }}
          </div>
          <h3 class="t-leading-tight t-text-2xl t-font-semibold">
            {{ look.title }}
          </h3>
          <div class="t-text-sm t-font-thin">
            <a :href="`https://www.instagram.com/${look.modelInstagram}`" target="_blank" :title="`@${look.modelInstagram}` | htmlDecode">
              <material-icon icon="instagram" icon-set="icmaa" size="xs" class="t-align-text-bottom" />
              {{ look.modelInstagram }}
            </a>
          </div>
          <div v-if="look.description" class="t-text-sm t-mt-2">
            {{ look.description }}
          </div>
        </div>
        <picture-component :src="look.image" :width="imageWidth" :height="imageHeight" :sizes="imageSizes" :placeholder="true" :ratio="`${imageWidth}:${imageHeight}`" :alt="look.title | htmlDecode" />
      </div>
    </div>
    <div class="t-w-full md:t-w-2/3 t-px-2">
      <div class="t-flex t-flex-wrap t--mx-2">
        <product-tile v-for="(p, i) in products" :key="`look-product-${look.uid}-${i}`" :product="p" class="product t-cursor-pointer t-px-2 t-mb-8 t-w-1/2 md:t-w-1/3" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import PictureComponent from 'theme/components/core/blocks/Picture'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
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
    MaterialIcon,
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
  watch: {
    look () {
      this.loadProducts()
    }
  },
  methods: {
    async loadProducts (skus) {
      return this.$store.dispatch('icmaaLooks/getLookProducts', this.look.products || [])
    }
  },
  async serverPrefetch () {
    return this.loadProducts()
  },
  async mounted () {
    return this.loadProducts()
  }
}
</script>
