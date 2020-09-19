<template>
  <picture>
    <source v-for="sImage in sourceImages" :key="sImage.srcset" :media="sImage.media" :data-srcset="sImage.srcset" :alt="alt + sImage.media">
    <img :src="placeholder" :data-src="defaultImage.src" :data-srcset="`${defaultImage.src} 1x, ${defaultImage.srcAt2x} 2x`" class="product-image t-w-full t-w-auto" v-bind="$attrs" v-on="$listeners" ref="image">
  </picture>
</template>

<script>
import config from 'config'
import Lozad from 'icmaa-config/helpers/lozad'
import { getThumbnailPath } from '@vue-storefront/core/helpers'

export default {
  name: 'ProductImage',
  inheritAttrs: false,
  props: {
    image: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    sizes: {
      type: [Array, Boolean],
      default: false
    },
    type: {
      type: String,
      default: 'thumbnails',
      validation: (value) => ['gallery', 'thumbnails'].includes(value)
    }
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    sizeMap () {
      return this.sizes || [
        // Order high-to-low is important
        { media: '(min-width: 1280px)', width: 300 },
        { media: '(min-width: 1024px)', width: 236 },
        { media: '(min-width: 415px)', width: 364 },
        { media: '(max-width: 414px)', width: 188 }
      ]
    },
    sourceImages () {
      const { width, height } = this.typeSize
      return this.sizeMap.map(image => {
        image.height = Math.ceil((height / width) * image.width)

        const image1x = this.getImageWithSize(image.width, image.height)
        const image2x = this.getImageWithSize(image.width * 2, image.height * 2)
        const image3x = this.getImageWithSize(image.width * 3, image.height * 3)
        image.srcset = `${image1x} 1x, ${image2x} 2x, ${image3x} 3x`

        return image
      })
    },
    defaultImage () {
      const { width, height } = this.typeSize
      return {
        src: this.getImageWithSize(width, height),
        srcAt2x: this.getImageWithSize(width * 2, height * 2)
      }
    },
    typeSize () {
      return config.products[this.type]
    },
    placeholder () {
      return require('theme/assets/product-placeholder-loading.svg')
    }
  },
  methods: {
    getImageWithSize (width = 0, height = 0) {
      const src = this.image || ''
      return getThumbnailPath(src, width, height)
    },
    onLoaded () {
      if (this.loading === true) {
        this.loading = !this.loading
        this.$emit(
          'load',
          { original: this.image, current: this.$refs.image.currentSrc }
        )
      }
    }
  },
  mounted () {
    const imageLazyLoader = new Lozad(this.$el, {
      rootMargin: '50px 0px 0px 0px',
      loaded: () => {
        this.$refs.image.addEventListener('load', this.onLoaded)
      }
    })
  }
}
</script>
