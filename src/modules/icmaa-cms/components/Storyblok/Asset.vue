<template>
  <component
    :is="AsyncPicture"
    v-if="fieldType === 'asset'"
    :path-type="pathType"
    :src="asset.filename"
    :alt="asset.alt"
    :width="imgWidth"
    :height="imgHeight"
    :sizes="sizes"
    :placeholder="!!ratio"
    :ratio="ratio"
    :auto-reload="autoReload"
    :img-class="[orientation]"
  />
</template>

<script lang="ts">
const AsyncPicture = () => import(/* webpackChunkName: "vsf-content-block-picture" */ 'theme/components/core/blocks/Picture.vue')

export default {
  name: 'StoryblockAsset',
  props: {
    asset: {
      type: Object,
      required: true
    },
    sizes: {
      type: Array,
      required: true,
      default: () => ([])
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    autoReload: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      AsyncPicture
    }
  },
  computed: {
    size () {
      if (this.pathType === 'storyblok') {
        const regex = /\/(?<width>\d+)x(?<height>\d+)\//m
        const match = this.asset.filename.match(regex)
        if (match && match.groups) {
          const { width, height } = match.groups
          return { width: parseInt(width), height: parseInt(height) }
        }
      }

      return false
    },
    propSize () {
      if (this.size) {
        if (this.width > 0 && this.height === 0) {
          const height = Math.round((100 * this.width / this.size.width) / 100 * this.size.height)
          return { width: this.width, height }
        } else if (this.height > 0 && this.width === 0) {
          const width = Math.round((100 * this.height / this.size.height) / 100 * this.size.width)
          return { height: this.height, width }
        }
      }

      return this.size
    },
    imgWidth () {
      return this.width || this.propSize?.width || 0
    },
    imgHeight () {
      return this.height || this.propSize?.height || 0
    },
    fieldType () {
      return this.asset.fieldtype
    },
    pathType () {
      return this.asset.is_external_url ? 'external' : 'storyblok'
    },
    ratio () {
      if (!this.size) return undefined

      let width = this.propSize.width
      let height = this.propSize.height
      for (let num = height; num > 1; num--) {
        if ((width % num) === 0 && (height % num) === 0) {
          width = width / num
          height = height / num
        }
      }
      return `${width}:${height}`
    },
    orientation () {
      return this.imgWidth < this.imgHeight
        ? 'portrait' : (this.imgWidth === this.imgHeight ? 'square' : 'landscape')
    }
  }
}
</script>
