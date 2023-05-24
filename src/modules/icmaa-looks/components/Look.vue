<template>
  <div class="t--mx-2 t-flex t-flex-wrap t-items-start">
    <div class="t-mb-4 t-w-full t-px-2 md:t-w-1/3">
      <div class="t-bg-white">
        <div class="t-p-4">
          <div class="t-mt-2 t-mb-3 t-text-xs t-font-light t-text-base-light">
            {{ createdAt }}
          </div>
          <h3 class="t-text-2xl t-font-semibold t-leading-tight">
            {{ look.title }}
          </h3>
          <div class="t-text-sm t-font-extralight">
            <a
              :href="`https://www.instagram.com/${look.modelInstagram}`"
              target="_blank"
              :title="`@${look.modelInstagram}` | htmlDecode"
            >
              <material-icon
                icon="instagram"
                icon-set="icmaa"
                size="xs"
                class="t-align-text-bottom"
              />
              {{ look.modelInstagram }}
            </a>
          </div>
          <div
            v-if="look.description"
            class="t-mt-2 t-text-sm"
          >
            {{ look.description }}
          </div>
        </div>
        <picture-component
          :key="look.image"
          :src="look.image"
          :width="imageWidth"
          :height="imageHeight"
          :sizes="imageSizes"
          :placeholder="true"
          :ratio="`${imageWidth}:${imageHeight}`"
          :alt="look.title | htmlDecode"
        />
      </div>
    </div>
    <div class="t-w-full t-px-2 md:t-w-2/3">
      <div class="t--mx-2 t-flex t-flex-wrap">
        <product-tile
          v-for="(p, i) in products"
          :key="`look-product-${look.uid}-${i}`"
          :product="p"
          class="product t-mb-8 t-w-1/2 t-cursor-pointer t-px-2 md:t-w-1/3"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { toDate } from 'icmaa-config/helpers/datetime'

import PictureComponent from 'theme/components/core/blocks/Picture'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import ProductTile from 'theme/components/core/ProductTile'

export default {
  name: 'Look',
  components: {
    PictureComponent,
    MaterialIcon,
    ProductTile
  },
  props: {
    look: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({ getProducts: 'icmaaLooks/getProducts' }),
    createdAt () {
      return toDate(this.look.created)
    },
    imageWidth () {
      return 360
    },
    imageHeight () {
      return 500
    },
    imageSizes () {
      return [
        { media: 'xl', width: 360 },
        { media: 'lg', width: 236 },
        { media: 'xs', width: 364 },
        { width: 188 }
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
  async mounted () {
    return this.loadProducts()
  },
  methods: {
    async loadProducts (skus) {
      return this.$store.dispatch('icmaaLooks/getLookProducts', this.look.products || [])
    }
  },
  async serverPrefetch () {
    return this.loadProducts()
  }
}
</script>
