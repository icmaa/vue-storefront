<template>
  <picture>
    <source v-for="(sImage, i) in sourceImages" :key="sImage.srcset + '-' + i" :media="sImage.media" :data-srcset="sImage.srcset" :alt="alt + (sImage.alt || '')">
    <img :src="defaultImage.src" :data-src="defaultImage.src" :data-srcset="`${defaultImage.src} 1x, ${defaultImage.srcAt2x} 2x`" :class="[{ 't-hidden': (placeholder && loading), 't-w-full': imgFullSize }, ...imgClassTransformed]" v-bind="$attrs" v-on="$listeners" @error="loading = true" ref="image" :alt="alt">
    <placeholder :ratio="ratio" v-if="placeholder && loading" :class="placeholderClassTransformed" />
  </picture>
</template>

<script>
import Placeholder from 'theme/components/core/blocks/Placeholder'
import LozadMixin from 'theme/mixins/lozadMixin'
import cloneDeep from 'lodash-es/cloneDeep'
import { getThumbnailPath } from '@vue-storefront/core/helpers'

export default {
  name: 'Picture',
  mixins: [ LozadMixin ],
  inheritAttrs: false,
  components: {
    Placeholder
  },
  props: {
    src: {
      type: String,
      required: true
    },
    pathType: {
      type: String,
      default: 'media'
    },
    alt: {
      type: String,
      default: ''
    },
    imgClass: {
      type: [Array, Object, String],
      default: () => ({})
    },
    imgFullSize: {
      type: [Boolean],
      default: true
    },
    placeholderClass: {
      type: [Array, Object, String],
      default: () => ({})
    },
    sizes: {
      type: [Array, Boolean],
      default: false
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: Boolean,
      default: false
    },
    ratio: {
      type: String,
      default: '3:4'
    },
    autoReload: {
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
    image () {
      return this.preparePath(this.src)
    },
    imgClassTransformed () {
      return this.prepareClassProp(this.imgClass)
    },
    placeholderClassTransformed () {
      return this.prepareClassProp(this.placeholderClass)
    },
    sizeMap () {
      return this.sizes || []
    },
    sourceImages () {
      /**
       * We need to use cloneDeep to not mutate the parent property or original computed item using `map`.
       * @see https://medium.com/@gamshan001/javascript-deep-copy-for-array-and-object-97e3d4bc401a
       */
      return cloneDeep(this.sizeMap).map(image => {
        image.height = Math.ceil((this.height / this.width) * image.width)
        const src = image.src ? this.preparePath(image.src) : this.image

        const image1x = this.getImageWithSize(src, image.width, image.height)
        const image2x = this.getImageWithSize(src, image.width * 2, image.height * 2)
        const image3x = this.getImageWithSize(src, image.width * 3, image.height * 3)
        image.srcset = `${image1x} 1x, ${image2x} 2x, ${image3x} 3x`

        return image
      })
    },
    defaultImage () {
      return {
        src: this.getImageWithSize(this.image, this.width, this.height),
        srcAt2x: this.getImageWithSize(this.image, this.width * 2, this.height * 2)
      }
    }
  },
  methods: {
    preparePath (path) {
      if (!path.startsWith('http') && !path.startsWith('/')) {
        return `/${path}`
      }

      return `${path}`
    },
    getImageWithSize (src, width = 0, height = 0) {
      return getThumbnailPath(src, width, height, this.pathType || 'media')
    },
    prepareClassProp (value) {
      if (typeof value === 'string') {
        return { [value]: true }
      } else if (Array.isArray(value)) {
        return value
      } else if (typeof value === 'object') {
        return [value]
      }

      return {}
    },
    loaded () {
      if (this.loading) {
        this.loading = false
        this.$emit('load')
      }
    }
  },
  mounted () {
    this.lazyload(
      this.$el,
      {
        enableAutoReload: this.autoReload,
        loaded: () => {
          this.$refs.image.addEventListener('load', this.loaded)
        }
      }
    )
  }
}
</script>
