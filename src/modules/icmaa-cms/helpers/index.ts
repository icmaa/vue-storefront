import Vue from 'vue'
import { localizedRoute, currentStoreView } from '@vue-storefront/core/lib/multistore'
import merge from 'lodash-es/merge'

// @ts-ignore:next-line
const AsyncPictureComp = () => import(/* webpackChunkName: "vsf-content-block-picture" */ 'theme/components/core/blocks/Picture')

interface Options {
  wrapper?: string,
  cssClasses?: CssClasses,
  imageOptions?: ImageOptions
}

interface CssClasses {
  [key: string]: string,
  a?: string,
  img?: string,
  p?: string,
  blockquote?: string,
  ul?: string,
  ol?: string,
  li?: string,
  h1?: string,
  h2?: string,
  h3?: string,
  h4?: string
}

const cssClassesDefaults: CssClasses = {
  a: 't-underline',
  ol: 't-list-decimal t-ml-4',
  ul: 't-list-disc t-ml-4',
  blockquote: 't-border-l-4 t-border-base-lighter t-pl-4 t-py-2 t-italic'
}

interface ImageOptions {
  sizes?: { media?: string, width: number }[] | null,
  width?: number,
  height?: number,
  [key: string]: any
}

const imageOptionsDefaults: ImageOptions = {
  sizes: [
    { media: 'xl', width: 360 },
    { media: 'lg', width: 236 },
    { media: 'xs', width: 364 },
    { width: 188 }
  ],
  width: 360,
  height: 500
}

/**
 * This method searches for <a> tags inside an HTML string and replace them using <router-link>.
 * We used the `vue.esm` bundle before to render links, this way we can do it without bloating the bundle.
 * @see https://levelup.gitconnected.com/vue-js-replace-a-with-router-link-in-dynamic-html-c423beea0d17
 * @see https://v2.vuejs.org/v2/guide/installation.html?redirect=true#Runtime-Compiler-vs-Runtime-only
 *
 * @param {string} text
 * @param {string} wrapper
 * @return {object}
 */
export const stringToComponent = (text: string, options?: Options): object => {
  options = merge({}, { wrapper: 'div', cssClasses: cssClassesDefaults, imageOptions: imageOptionsDefaults }, options)
  const { wrapper, cssClasses, imageOptions } = options

  return {
    render (createElement) {
      // https://vuejs.org/v2/guide/render-function.html#createElement-Arguments
      const options = {
        domProps: { innerHTML: text }
      }
      return createElement(wrapper, options)
    },
    mounted () {
      this.addDefaultCssClasses()
      this.parseAnchors(this.$el.getElementsByTagName('a'))
      this.parseImages(this.$el.getElementsByTagName('img'))
    },
    methods: {
      parseAnchors (anchors: HTMLAnchorElement[]) {
        Array.from(anchors).forEach((anchor: HTMLAnchorElement) => {
          const url = anchor.getAttribute('href')

          // Skip external links and mail to
          if (/^(http|https|mailto:):\/\//.test(url)) {
            anchor.setAttribute('class', cssClasses.a)
            return
          }

          // https://vuejs.org/v2/api/#propsData
          const propsData = { to: localizedRoute(url) }
          // https://vuejs.org/v2/api/#parent
          // Without parent context RouterLink will be unable to access this.$router, etc.
          const parent = this

          const RouterLink = Vue.component('RouterLink')
          const routerLink = new RouterLink({ propsData, parent })

          // Mount and replaces anchor element
          routerLink.$mount(anchor)

          // Replace innerHtml
          routerLink.$el.innerHTML = anchor.innerHTML

          // Add original css classes
          const cssClass = anchor.getAttribute('class')
          if (cssClass) routerLink.$el.setAttribute('class', cssClass)

          // Add original title if needed
          const title = anchor.getAttribute('title')
          if (title) routerLink.$el.setAttribute('title', title)
        })
      },
      parseImages (images: HTMLImageElement[]) {
        const imgArray = Array.from(images).filter(img => {
          return !img.getAttribute('src').startsWith('http')
        })

        if (imgArray.length > 0) {
          AsyncPictureComp().then(c => {
            const PictureComp = c.default
            imgArray.forEach((img: HTMLElement) => {
              const url = img.getAttribute('src')

              const parent = this
              const { sizes, width, height } = imageOptions
              const propsData = { src: url, sizes, width, height }

              const alt = img.getAttribute('alt') || img.getAttribute('title')
              if (alt) Object.assign(propsData, { alt })

              const Picture = Vue.component('PictureComponent', PictureComp)
              const picture = new Picture({ propsData, parent })

              picture.$mount(img)

              // Add original css classes
              const cssClass = img.getAttribute('class')
              if (cssClass) picture.$el.setAttribute('class', cssClass)
            })
          })
        }
      },
      addDefaultCssClasses () {
        for (let tag in cssClasses) {
          Array.from(this.$el.getElementsByTagName(tag))
            .forEach(($el: HTMLElement) => {
              $el.setAttribute('class', cssClasses[tag])
            })
        }
      }
    }
  }
}

export const getCurrentStoreCode = (): string => {
  return !currentStoreView() ? null : currentStoreView().storeCode
}
