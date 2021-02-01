export default {
  data () {
    return {
      inViewport: false
    }
  },
  mounted () {
    if (!('IntersectionObserver' in window)) {
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
