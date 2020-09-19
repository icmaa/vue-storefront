import lozad from 'lozad'

/**
 * We overwrite the default `load` method to have better support for <picture> tag.
 */
export default class Lozad {
  public constructor ($el, options = {}) {
    const defaults = { load: this.load }
    options = Object.assign(defaults, options)

    const observer = lozad($el, options)
    observer.observe()
  }

  protected load (element: HTMLElement) {
    if (element.nodeName.toLowerCase() === 'picture') {
      if (element.children) {
        var sources = element.children
        Object.values(sources).forEach(source => {
          const sourceSrcSet = source.getAttribute('data-srcset')
          if (sourceSrcSet) {
            source.setAttribute('srcset', sourceSrcSet)
          }
        })
      }
    }

    if (element.getAttribute('data-src')) {
      element.setAttribute('src', element.getAttribute('data-src'))
    }

    if (element.getAttribute('data-srcset')) {
      element.setAttribute('srcset', element.getAttribute('data-srcset'))
    }
  }
}
