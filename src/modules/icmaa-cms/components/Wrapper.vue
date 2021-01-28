<template>
  <div class="t-flex t-flex-wrap t--mx-4 t-flex-full">
    <div v-for="(c, i) in componentsReady" :key="`${c.name}-${i}`" class="t-flex-auto" :class="[{ 't-px-4': c.padding, 't-w-full': (c.size === 'full'), 'lg:t-w-1/2': (c.size === 'half') }, c.cssClass]">
      <router-link v-if="c.hasLink" :to="localizedRoute(c.props.componentLink)">
        <component :is="c.component" v-bind="c.props" :name="c.type" />
      </router-link>
      <component :is="c.component" v-bind="c.props" :name="c.type" v-else />
    </div>
  </div>
</template>

<script>
import omit from 'lodash-es/omit'
import pickBy from 'lodash-es/pickBy'
import mapKeys from 'lodash-es/mapKeys'
import mapValues from 'lodash-es/mapValues'
import camelCase from 'lodash-es/camelCase'

const AsyncLogoline = () => import(/* webpackChunkName: "vsf-content-block-logoline" */ 'theme/components/core/blocks/CategoryExtras/LogoLine')
const AsyncTeaser = () => import(/* webpackChunkName: "vsf-content-block-teaser" */ 'theme/components/core/blocks/Teaser/Teaser')
const AsyncText = () => import(/* webpackChunkName: "vsf-content-block-text" */ 'theme/components/core/blocks/RichText')
const AsyncPicture = () => import(/* webpackChunkName: "vsf-content-block-picture" */ 'theme/components/core/blocks/Picture')
const AsyncProductlisting = () => import(/* webpackChunkName: "vsf-content-block-productlisting" */ '../../icmaa-category/components/ProductListingWidget')

export default {
  name: 'CmsBlockWrapper',
  props: {
    components: {
      type: Array,
      required: true
    }
  },
  computed: {
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
            staticItems: 'json',
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
          propsTypes: {},
          propsDefaults: {},
          cssClass: 't-mb-8',
          padding: false
        },
        'component_image': {
          component: AsyncPicture,
          propsTypes: {
            sizes: 'json'
          },
          propsDefaults: {},
          cssClass: 't-mb-8',
          padding: true
        },
        'component_productlisting': {
          component: AsyncProductlisting,
          propsTypes: {
            limit: 'number',
            categoryId: 'number',
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
        .map(c => {
          const componentsMap = this.componentsMap[c.component]
          const { component, propsTypes, propsDefaults, cssClass, padding } = componentsMap

          const size = c.hasOwnProperty('width') ? c.width : 'full'

          let props = mapKeys(
            omit(c, ['_uid', 'component', 'width']),
            (v, k) => camelCase(k)
          )

          props = pickBy(props, (p, k) => {
            return p !== '' || (propsTypes[k] && propsTypes[k] === 'number' && p === 0)
          })

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

          const type = c.component.replace('component_', '')
          const hasLink = Object.keys(props).includes('componentLink')

          return { type, component, props, cssClass, padding, size, hasLink }
        })
    }
  }
}
</script>
