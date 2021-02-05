import { isServer } from '@vue-storefront/core/helpers'

/**
 * Everything you need to know about IntersectionObserver:
 * @see https://www.smashingmagazine.com/2018/01/deferring-lazy-loading-intersection-observer-api/
 *
 * @todo Load components only when needed
 */

export default {
  props: {
    serverRendering: {
      type: Boolean,
      default: false
    },
    intersectOptions: {
      type: Object,
      default: () => {}
    },
    timeout: {
      type: Number,
      default: 0
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
    if ((isServer && this.serverRendering) || (!isServer && !('IntersectionObserver' in window))) {
      this.inViewport = true
      return
    } else if (isServer && !this.serverRendering) {
      return
    }

    let observerCallback = this.observerCallback
    if (this.timeout > 0) {
      let timeout
      observerCallback = (e, o) => {
        clearTimeout(timeout)
        timeout = setTimeout(this.observerCallback.bind(this, e, o), this.timeout)
      }
    }

    const observerOptions = Object.assign({ rootMargin: '200px 0px' }, this.intersectOptions)
    const observer = new IntersectionObserver(observerCallback, observerOptions)
    observer.observe(this.$el)
  },
  methods: {
    observerCallback (entries, observer) {
      if (!entries[0].isIntersecting) return

      this.inViewport = true
      this.$emit('visible')

      observer.unobserve(this.$el)
    }
  }
}
