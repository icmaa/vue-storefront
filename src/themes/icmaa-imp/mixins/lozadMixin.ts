import lozad from 'lozad'

/**
 * We overwrite the default `load` method to have better support for <picture> tag.
 */
export default {
  data () {
    return {
      lazyloadObserver: undefined
    }
  },
  methods: {
    lazyloadLoad (element: HTMLElement) {
      var isIE = typeof document !== 'undefined' && document['documentMode']
      if (element.nodeName.toLowerCase() === 'picture') {
        if (element.children) {
          var sources = element.children
          Object.values(sources).forEach(source => {
            if (!isIE && source.nodeName.toLowerCase() !== 'source') return
            const sourceSrc = source.getAttribute('data-src')
            const sourceSrcSet = source.getAttribute('data-srcset')
            if (sourceSrc) source.setAttribute('src', sourceSrc)
            if (sourceSrcSet) source.setAttribute('srcset', sourceSrcSet)
          })
        }
      }
    },
    lazyload ($el: any, options: any = {}) {
      /**
       * We can't use native `enableAutoReload` option because this calls the original `load` method inside
       * its event observer. So we need to add our own observer code and load it using our method.
       */
      if (options.enableAutoReload === true && (window && window['MutationObserver'])) {
        delete options.enableAutoReload

        const isLoaded = element => element.getAttribute('data-loaded') === 'true'
        const attributeFilter = ['data-src', 'data-srcset']

        const ImageMutationObserver = new MutationObserver(mutations => {
          for (let entry of mutations) {
            const parent = (entry.target as HTMLElement).parentElement
            if (isLoaded(parent) && entry.type === 'attributes' && attributeFilter.indexOf(entry.attributeName) > -1) {
              this.lazyloadLoad(parent)
            }
          }
        })

        ImageMutationObserver.observe($el, { subtree: true, attributes: true, attributeFilter })
      }

      const defaults = { load: this.lazyloadLoad }

      this.lazyloadObserver = lozad($el, Object.assign(defaults, options))
      this.lazyloadObserver.observe()
    }
  }
}
