import lozad from 'lozad'

/**
 * We overwrite the default `load` method to have better support for <picture> tag.
 */
export default {
  methods: {
    lazyload ($el: any, options = {}) {
      const defaults = {
        load: (element: HTMLElement) => {
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
        }
      }

      const observer = lozad($el, Object.assign(defaults, options))
      observer.observe()
    }
  }
}
