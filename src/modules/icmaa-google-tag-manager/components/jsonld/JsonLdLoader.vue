<template>
  <component
    v-if="isFirstPageCall"
    :is="asyncJsonLdComponent"
  />
</template>

<script>

import { mapGetters } from 'vuex'

const productComp = () => import(/* webpackChunkName: "vsf-jsonld-product" */ './Product')

export default {
  name: 'JsonLdLoader',
  data () {
    return {
      productComp
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
