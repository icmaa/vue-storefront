<template>
  <div class="t-flex t-flex-wrap t--mx-4">
    <div v-for="(c, i) in componentsReady" :key="`${c.name}-${i}`" class="t-w-full t-px-4">
      <component :is="c.component" v-bind="c.props" :name="c.name" />
    </div>
  </div>
</template>

<script>

import omit from 'lodash-es/omit'
import mapKeys from 'lodash-es/mapKeys'
import mapValues from 'lodash-es/mapValues'
import camelCase from 'lodash-es/camelCase'

const AsyncLogoline = () => import(/* webpackPreload: true */ /* webpackChunkName: "vsf-block-logoline" */ 'theme/components/core/blocks/CategoryExtras/LogoLine')
const AsyncTeaser = () => import(/* webpackPreload: true */ /* webpackChunkName: "vsf-block-teaser" */ 'theme/components/core/blocks/Teaser/Teaser')

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
          }
        },
        'component_logoline': {
          component: AsyncLogoline,
          propsTypes: {
            parentId: 'number',
            limit: 'number'
          }
        }
      }
    },
    componentsReady () {
      return this.components
        .filter(c => Object.keys(this.componentsMap).includes(c.component))
        .map(c => {
          const componentsMap = this.componentsMap[c.component]
          const { component, propsTypes } = componentsMap

          let props = mapKeys(
            omit(c, ['_uid', 'component']),
            (v, k) => camelCase(k)
          )

          props = mapValues(props, (p, k) => {
            if (Object.keys(propsTypes).includes(k)) {
              switch (propsTypes[k]) {
                case 'number':
                  p = parseInt(p)
                  break
              }

              if (typeof propsTypes[k] === 'function') {
                p = propsTypes[k](p)
              }
            }

            return p
          })

          console.log(props)

          return { component, props }
        })
    }
  }
}
</script>
