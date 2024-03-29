<template>
  <picture>
    <source
      v-for="(sImage, i) in sourceImages"
      :key="sImage.srcset + '-' + i"
      :media="sImage.media"
      :data-srcset="sImage.srcset"
      :alt="alt + (sImage.alt || '')"
    >
    <img
      ref="image"
      :data-src="defaultImage.src"
      :data-srcset="`${defaultImage.src} 1x, ${defaultImage.srcAt2x} 2x`"
      :class="[{ 't-hidden': (placeholder && loading), 't-w-full': imgFullSize }, ...imgClassTransformed]"
      v-bind="{ ...$attrs, ...dimensions }"
      :alt="alt"
      v-on="$listeners"
      @error="loading = true"
    >
    <Placeholder
      v-if="placeholder && loading"
      :ratio="ratio"
      :class="placeholderClassTransformed"
    />
  </picture>
</template>

<script>
import Placeholder from 'theme/components/core/blocks/Placeholder'
import LozadMixin from 'theme/mixins/lozadMixin'
import { viewportSizes } from 'theme/store/ui'
import cloneDeep from 'lodash-es/cloneDeep'

export default {
  name: 'PictureComponent',
  components: {
    Placeholder
  },
  mixins: [ LozadMixin ],
  inheritAttrs: false,
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
    },
    preloadInHeader: {
      type: Boolean,
      default: false
    },
    preloadInHeaderPrefix: {
      type: String,
      default: 'category-header-image-'
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
        image.height = image?.height || Math.ceil((this.height / this.width) * image.width)
        const src = image.src ? this.preparePath(image.src) : this.image

        const image1x = this.getImageWithSize(src, image.width, image.height)
        const image2x = this.getImageWithSize(src, image.width * 2, image.height * 2)
        const image3x = this.getImageWithSize(src, image.width * 3, image.height * 3)
        image.srcset = `${image1x} 1x, ${image2x} 2x, ${image3x} 3x`

        image.media = this.prepareMedia(image.media)

        return image
      })
    },
    defaultImage () {
      return {
        src: this.getImageWithSize(this.image, this.width, this.height),
        srcAt2x: this.getImageWithSize(this.image, this.width * 2, this.height * 2)
      }
    },
    dimensions () {
      const dimensions = {}
      if (this.width > 0) dimensions.width = this.width
      if (this.height > 0) dimensions.height = this.height
      return dimensions
    }
  },
  mounted () {
    this.lazyload(
      this.$el,
      {
        enableAutoReload: this.autoReload,
        loaded: () => {
          this.$refs.image.addEventListener('load', this.loaded)
          this.$once('hook:destroyed', () => {
            document.removeEventListener('load', this.onLoaded)
          })
        }
      }
    )
  },
  methods: {
    preparePath (path) {
      if (!path.startsWith('http') && !path.startsWith('/')) {
        return `/${path}`
      }

      return `${path}`
    },
    getImageWithSize (src, width = 0, height = 0) {
      return this.getThumbnail(src, width, height, this.pathType || 'media')
    },
    prepareMedia (media) {
      const sizes = viewportSizes

      if (!media) return `(max-width: ${sizes.xs}px)`

      if (Object.keys(sizes).includes(media)) {
        return `(min-width: ${sizes[media]}px)`
      }

      // eslint-disable-next-line no-useless-escape
      const regex = new RegExp(`\\(*(?<scope>min|max)-(?<dimension>width|height):\\s*(?<size>${Object.keys(sizes).join('|')}|\\w+(px|%|vw|vh))\\)*`, 'gm')

      const result = regex.exec(media)
      if (!result) return media

      const { scope, dimension, size } = result.groups
      if (Object.keys(sizes).includes(size)) {
        return media.replace(regex, `(${scope}-${dimension}: ${sizes[size]}px)`)
      }

      return `(${scope}-${dimension}: ${size})`
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
  metaInfo () {
    if (!this.preloadInHeader) return {}

    const link = []
    const sourceImages = cloneDeep(this.sourceImages).map(img => {
      const regex = /(min-width|max-width):\s([0-9]+)(\w+)/gm
      img.media = [...img.media.matchAll(regex)].map(([txt, scale, value, unit]) => ({ scale, value, unit }))
      return img
    })

    sourceImages.forEach(({ media, srcset }, i, array) => {
      let mediaStr = media
      const fromScale = media[0].scale
      const toValueSubstract = fromScale === 'min-width' ? -1 : 1
      const wImg = fromScale === 'min-width' ? array[i - 1] : array[i + 1]
      if (i > 0 && mediaStr.length === 1 && wImg) {
        const to = fromScale === 'min-width' ? 'max-width' : fromScale
        mediaStr.push({ scale: to, value: parseInt(wImg.media[0].value) + toValueSubstract, unit: wImg.media[0].unit })
      }

      mediaStr = mediaStr.map(m => `(${m.scale}: ${m.value}${m.unit})`).join(' and ')

      link.push({
        vmid: this.preloadInHeaderPrefix + (i + 1),
        rel: 'preload',
        as: 'image',
        imagesrcset: srcset,
        media: mediaStr
      })
    })

    return { link }
  }
}
</script>
