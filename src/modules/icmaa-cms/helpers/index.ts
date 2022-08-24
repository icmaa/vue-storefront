import Vue from 'vue'
import { localizedRoute, currentStoreView } from '@vue-storefront/core/lib/multistore'

// @ts-ignore:next-line
const AsyncPictureComp = () => import(/* webpackChunkName: "vsf-content-block-picture" */ 'theme/components/core/blocks/Picture')

interface LinkOptions {
  class: string
}

interface ImageOptions {
  class: string,
  sizes?: { media: string, width: number }[] | null,
  width?: number,
  height?: number,
  [key: string]: any
}

const LinkDefaults: LinkOptions = {
  class: 't-underline'
}

const ImageDefaults: ImageOptions = {
  class: 't-block t-mb-4 lg:t-float-right lg:t-ml-4',
  sizes: [
    { media: '(min-width: 1280px)', width: 360 },
    { media: '(min-width: 1024px)', width: 236 },
    { media: '(min-width: 415px)', width: 364 },
    { media: '(max-width: 414px)', width: 188 }
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
export const stringToComponent = (text: string, wrapper: string = 'div', linkOptions: LinkOptions = LinkDefaults, imageOptions: ImageOptions = ImageDefaults): object => {
  return {
    render (createElement) {
      // https://vuejs.org/v2/guide/render-function.html#createElement-Arguments
      const options = {
        domProps: { innerHTML: text }
      }
      return createElement(wrapper, options)
    },
    mounted () {
      this.parseAnchors(this.$el.getElementsByTagName('a'))
      this.parseImages(this.$el.getElementsByTagName('img'))
    },
    methods: {
      parseAnchors (anchors: HTMLAnchorElement[]) {
        Array.from(anchors).forEach((anchor: HTMLAnchorElement) => {
          const url = anchor.getAttribute('href')

          // Skip external links and mail to
          if (/^(http|https|mailto:):\/\//.test(url)) {
            anchor.setAttribute('class', linkOptions.class)
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

          // Add default Tailwind class
          routerLink.$el.setAttribute('class', 't-underline')

          // Add original title if needed
          const title = anchor.getAttribute('title')
          if (title) routerLink.$el.setAttribute('title', title)
        })
      },
      parseImages (images: HTMLImageElement[]) {
        if (Array.from(images).length > 0) {
          AsyncPictureComp().then(c => {
            const PictureComp = c.default
            Array.from(images).forEach((img: HTMLElement) => {
              const url = img.getAttribute('src')

              const parent = this
              const { sizes, width, height } = imageOptions
              const propsData = { src: url, sizes, width, height }

              const alt = img.getAttribute('alt') || img.getAttribute('title')
              if (alt) Object.assign(propsData, { alt })

              const Picture = Vue.component('Picture', PictureComp)
              const picture = new Picture({ propsData, parent })

              picture.$mount(img)

              picture.$el.setAttribute('class', imageOptions.class)
            })
          })
        }
      }
    }
  }
}

export const getCurrentStoreCode = (): string => {
  return !currentStoreView() ? null : currentStoreView().storeCode
}
