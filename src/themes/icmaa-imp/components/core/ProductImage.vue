<template>
  <picture>
    <source
      v-for="(sImage, i) in sourceImages"
      :key="i + '-' + sImage.key"
      :media="sImage.media"
      :data-srcset="sImage.srcset"
      :alt="alt + ` - ${sImage.width}px`"
    >
    <img
      :src="placeholder"
      :data-src="defaultImage.src"
      :data-srcset="`${defaultImage.src} 1x, ${defaultImage.srcAt2x} 2x`"
      class="product-image t-w-full"
      v-bind="$attrs"
      v-on="$listeners" :alt="alt" ref="image"
      width="186"
      height="269"
    >
  </picture>
</template>

<script>
import config from 'config'
import cloneDeep from 'lodash-es/cloneDeep'
import LozadMixin from 'theme/mixins/lozadMixin'

export default {
  name: 'ProductImage',
  mixins: [ LozadMixin ],
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
      validation: (value) => ['fullsize', 'gallery', 'thumbnails'].includes(value)
    },
    enableAutoReload: {
      type: Boolean,
      default: false
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
      if (this.isFullSize) return []

      const { width, height } = this.typeSize
      /**
       * We need to use cloneDeep to not mutate the parent property or original computed item using `map`.
       * @see https://medium.com/@gamshan001/javascript-deep-copy-for-array-and-object-97e3d4bc401a
       */
      return cloneDeep(this.sizeMap).map(image => {
        image.height = Math.ceil((height / width) * image.width)

        const image1x = this.getImageWithSize(image.width, image.height)
        const image2x = this.getImageWithSize(image.width * 2, image.height * 2)
        const image3x = this.getImageWithSize(image.width * 3, image.height * 3)
        image.srcset = `${image1x} 1x, ${image2x} 2x, ${image3x} 3x`
        image.key = `${image.width}-${image.height}-${this.image}`

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
      return config.products[this.type] || { width: 0, height: 0 }
    },
    placeholder () {
      return require('theme/assets/product-placeholder-loading.svg')
    },
    isFullSize () {
      return this.type === 'fullsize'
    }
  },
  methods: {
    getImageWithSize (width = 0, height = 0) {
      const src = this.image || ''
      return this.getThumbnail(src, width, height)
    },
    onLoaded () {
      if (this.loading === true) {
        this.loading = !this.loading

        let current = false
        if (this.$refs.image) {
          current = this.$refs.image.currentSrc
        }

        this.$emit(
          'load',
          { original: this.image, current }
        )
      }
    }
  },
  mounted () {
    this.lazyload(
      this.$el,
      {
        enableAutoReload: this.enableAutoReload,
        loaded: () => {
          this.$refs.image.addEventListener('load', this.onLoaded)
          this.$once('hook:destroyed', () => {
            document.removeEventListener('load', this.onLoaded)
          })
        }
      }
    )
  }
}
</script>
