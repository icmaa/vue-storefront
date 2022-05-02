import Vue from 'vue'
import { localizedRoute, currentStoreView } from '@vue-storefront/core/lib/multistore'

export const getCurrentStoreCode = (): string => {
  return !currentStoreView() ? null : currentStoreView().storeCode
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
export const stringToComponent = (text: string, wrapper: string = 'div'): object => {
  return {
    render (createElement) {
      // https://vuejs.org/v2/guide/render-function.html#createElement-Arguments
      const options = {
        domProps: { innerHTML: text }
      }
      return createElement(wrapper, options)
    },
    mounted () {
      const anchors = this.$el.getElementsByTagName('a')
      Array.from(anchors).forEach((anchor: Element) => {
        const url = anchor.getAttribute('href')

        // Skip external links and mail to
        if (/^(http|https|mailto:):\/\//.test(url)) return

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

        // Add original title if needed
        const title = anchor.getAttribute('title')
        if (title) routerLink.$el.setAttribute('title', title)
      })
    }
  }
}
