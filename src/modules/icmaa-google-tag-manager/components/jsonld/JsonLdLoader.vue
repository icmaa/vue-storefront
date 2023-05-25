<template>
  <component
    :is="asyncJsonLdComponent"
    v-if="isFirstPageCall"
  />
</template>

<script>

import { mapGetters } from 'vuex'

const productComp = () => import(/* webpackChunkName: "vsf-jsonld-product" */ './Product')
const ticketComp = () => import(/* webpackChunkName: "vsf-jsonld-ticket" */ './Ticket')
const articleComp = () => import(/* webpackChunkName: "vsf-jsonld-article" */ './Article')
const breadcrumbsComp = () => import(/* webpackChunkName: "vsf-jsonld-breadcrumbs" */ './Breadcrumbs')

export default {
  name: 'JsonLdLoader',
  props: {
    type: {
      type: String,
      default: 'product'
    }
  },
  data () {
    return {
      productComp,
      ticketComp,
      breadcrumbsComp,
      articleComp
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
