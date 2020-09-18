<template>
  <picture v-on="$listeners">
    <source v-for="sImage in sourceImages" :key="sImage.srcset" :media="sImage.media" :srcset="sImage.srcset" :alt="alt + sImage.media">
    <img :src="defaultImage" ref="image" class="product-image t-w-full t-w-auto" v-bind="$attrs">
  </picture>
</template>

<script>
import config from 'config'
import { getThumbnailPath } from '@vue-storefront/core/helpers'

export default {
  name: 'ProductImage',
  props: {
    image: {
      type: Object,
      default: () => ({
        src: '',
        loading: ''
      })
    },
    alt: {
      type: String,
      default: ''
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
      return [
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
      return this.getImageWithSize(width, height)
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
      const src = this.image.src || ''
      return getThumbnailPath(src, width, height)
    },
    onLoaded ({ el, src }) {
      console.error('LOADED', this.$refs.image.currentSrc)
      if (this.loading === true) {
        this.loading = !this.loading
        this.$emit('load', this.image, !this.loading)
      }
    }
  },
  mounted () {
    this.$refs.image.addEventListener('load', this.onLoaded)
    this.$once('hook:destroyed', () => {
      this.$refs.image.removeEventListener('load', this.onLoaded)
    })
  }
}
</script>
