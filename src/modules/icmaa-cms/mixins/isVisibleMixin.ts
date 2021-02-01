import { isServer } from '@vue-storefront/core/helpers'

export default {
  props: {
    serverRendering: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      inViewport: false
    }
  },
  computed: {
    isServer () {
      return isServer
    }
  },
  mounted () {
    if (isServer || !('IntersectionObserver' in window)) {
      this.inViewport = true
      return
    }

    const observer = new IntersectionObserver(entries => {
      if (entries[0].intersectionRatio <= 0) return

      observer.unobserve(this.$el)

      this.inViewport = true
      this.$emit('visible')
    })

    observer.observe(this.$el)
  }
}
