<template>
  <img v-lazy="lazyObj" :data-srcset="`${sizes.src} 1x, ${sizes.srcAt2x} 2x`" v-on="$listeners" :alt="alt" class="product-image t-w-full t-w-auto" v-if="image.src">
  <img :src="sizes.error" :alt="alt" class="product-image t-w-full t-w-auto" v-else>
</template>

<script>
import config from 'config'
import pick from 'lodash-es/pick'
import { onlineHelper, getThumbnailPath } from '@vue-storefront/core/helpers'

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
    isOnline (value) {
      return onlineHelper.isOnline
    },
    sizes () {
      const { width, height } = config.products[this.type]
      return {
        loading: require('theme/assets/product-placeholder-loading.svg'),
        error: require(`theme/assets/product-placeholder-${!this.isOnline ? 'loading' : 'error'}.svg`),
        src: this.getImageWithSize(width, height),
        srcAt2x: this.getImageWithSize(width * 2, height * 2),
        original: this.getImageWithSize()
      }
    },
    lazyObj () {
      return pick(this.sizes, ['loading', 'error', 'src'])
    }
  },
  methods: {
    getImageWithSize (width = 0, height = 0) {
      const src = this.image.src || ''
      return getThumbnailPath(src, width, height)
    },
    onLoaded ({ el, src }) {
      if (this.loading === true) {
        this.loading = !this.loading
        this.$emit('load', this.image, !this.loading)
      }
    }
  },
  mounted () {
    this.$Lazyload.$once('loaded', this.onLoaded)
  }
}
</script>
