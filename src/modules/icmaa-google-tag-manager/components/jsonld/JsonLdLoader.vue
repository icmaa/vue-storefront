<template>
  <component
    v-if="isFirstPageCall"
    :is="asyncJsonLdComponent"
  />
</template>

<script>

import { mapGetters } from 'vuex'

const productComp = () => import(/* webpackChunkName: "vsf-jsonld-product" */ './Product')
const breadcrumbsComp = () => import(/* webpackChunkName: "vsf-jsonld-breadcrumbs" */ './Breadcrumbs')

export default {
  name: 'JsonLdLoader',
  data () {
    return {
      productComp,
      breadcrumbsComp
    }
  },
  props: {
    type: {
      type: String,
      default: 'product'
    }
  },
  computed: {
    ...mapGetters({
      prevRoute: 'url/getPrevRoute'
    }),
    asyncJsonLdComponent () {
      return this[this.type + 'Comp']
    },
    isFirstPageCall () {
      return !this.prevRoute?.fullPath
    }
  }
}
</script>
