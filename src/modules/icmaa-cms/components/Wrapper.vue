<template>
  <div class="t-flex t-flex-wrap t--mx-4 t-flex-full">
    <div v-for="(c, i) in componentsReady" :key="`${c.name}-${i}`" class="t-flex-auto" :class="[{ 't-px-4': c.padding, 'lg:t-w-1/2': (c.size === 'half') }, c.cssClass]">
      <component :is="c.component" v-bind="c.props" :name="c.name" />
    </div>
  </div>
</template>

<script>
import config from 'config'
import omit from 'lodash-es/omit'
import mapKeys from 'lodash-es/mapKeys'
import mapValues from 'lodash-es/mapValues'
import camelCase from 'lodash-es/camelCase'

const AsyncLogoline = () => import(/* webpackChunkName: "vsf-content-block-logoline" */ 'theme/components/core/blocks/CategoryExtras/LogoLine')
const AsyncTeaser = () => import(/* webpackChunkName: "vsf-content-block-teaser" */ 'theme/components/core/blocks/Teaser/Teaser')
const AsyncText = () => import(/* webpackChunkName: "vsf-content-block-text" */ 'theme/components/core/blocks/RichText')
const AsyncProductlisting = () => import(/* webpackChunkName: "vsf-content-block-productlisting" */ '../../icmaa-category/components/core/ProductListingWidget')

export default {
  name: 'CmsBlockWrapper',
  props: {
    components: {
      type: Array,
      required: true
    }
  },
  computed: {
    hideTeaser () {
      const { urlParamWhitelist } = config.icmaa_teaser
      const query = Object.keys(this.$route.query)
      if (query.length > 0 && query.some(el => urlParamWhitelist.includes(el))) {
        return false
      }
      return query.length > 0
    },
    componentsMap () {
      return {
        'component_teaser': {
          component: AsyncTeaser,
          propsTypes: {
            limit: 'number',
            tags: (v) => v.join(',')
          },
          propsDefaults: {},
          cssClass: 't-mb-8',
          padding: false
        },
        'component_logoline': {
          component: AsyncLogoline,
          propsTypes: {
            parentId: 'number',
            limit: 'number'
          },
          propsDefaults: {
            placeholder: true,
            columnClass: 't-w-1/3 md:t-w-1/6 lg:t-w-1/4 t-pb-2'
          },
          cssClass: 't-mb-4 lg:t-mb-6',
          padding: true
        },
        'component_text': {
          component: AsyncText,
          propsTypes: {
            content: 'string'
          },
          propsDefaults: {},
          cssClass: 't-mb-8',
          padding: false
        },
        'component_productlisting': {
          component: AsyncProductlisting,
          propsTypes: {
            limit: 'number',
            categoryId: 'number',
            sort: 'string',
            filter: 'json'
          },
          propsDefaults: {
            filter: {}
          },
          cssClass: 't-mb-8',
          padding: false
        }
      }
    },
    componentsReady () {
      return this.components
        .filter(c => Object.keys(this.componentsMap).includes(c.component))
        .filter(c => this.hideTeaser ? c.component !== 'component_teaser' : true)
        .map(c => {
          const componentsMap = this.componentsMap[c.component]
          const { component, propsTypes, propsDefaults, cssClass, padding } = componentsMap

          const size = c.hasOwnProperty('width') ? c.width : 'full'

          let props = mapKeys(
            omit(c, ['_uid', 'component', 'width']),
            (v, k) => camelCase(k)
          )

          props = Object.assign(propsDefaults, props)

          props = mapValues(props, (p, k) => {
            if (Object.keys(propsTypes).includes(k)) {
              switch (propsTypes[k]) {
                case 'number':
                  p = parseInt(p)
                  break
                case 'json':
                  if (typeof p === 'string') {
                    p = JSON.parse(p)
                  }
                  break
                default:
                  if (typeof propsTypes[k] === 'function') {
                    p = propsTypes[k](p)
                  }
              }
            }

            return p
          })

          return { component, props, cssClass, padding, size }
        })
    }
  }
}
</script>
