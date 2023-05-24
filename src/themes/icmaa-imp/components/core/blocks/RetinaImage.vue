<template>
  <div v-if="placeholder && loading">
    <Placeholder :ratio="ratio" />
    <img
      :src="src"
      :srcset="srcset"
      class="t-hidden"
      @load="loaded"
      @error="error"
    >
  </div>
  <img
    v-else
    :src="src"
    :srcset="srcset"
    @load="loaded"
    @error="error"
  >
</template>

<script>
import Placeholder from 'theme/components/core/blocks/Placeholder'

export default {
  name: 'RetinaImage',
  components: {
    Placeholder
  },
  props: {
    image: {
      type: String,
      required: true
    },
    placeholder: {
      type: Boolean,
      default: false
    },
    ratio: {
      type: String,
      default: '3:4'
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    path () {
      if (!this.image.startsWith('http') && !this.image.startsWith('/')) {
        return `/${this.image}`
      }

      return `${this.image}`
    },
    src () {
      return `${this.baseImage}`
    },
    srcset () {
      return `${this.baseImage} 1x, ${this.retinaImage} 2x`
    },
    resize () {
      return (this.width > 0 && this.height > 0)
    },
    baseImage () {
      if (this.resize) {
        return this.getMediaThumbnail(this.path, this.width, this.height, 'media')
      }

      return this.path
    },
    retinaImage () {
      if (this.resize) {
        return this.getMediaThumbnail(this.path, this.width * 2, this.height * 2, 'media')
      }

      return this.baseImage.replace(/(\.\w{3,4})(\?\w*)?$/gm, '@2x$1$2')
    }
  },
  methods: {
    loaded () {
      this.event('load')
    },
    error () {
      this.event('error')
    },
    event (action = 'load') {
      if (this.loading) {
        this.loading = false
        this.$emit(action)
      }
    }
  }
}
</script>
