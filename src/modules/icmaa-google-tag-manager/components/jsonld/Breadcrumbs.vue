<template>
  <JsonLd :dto="jsonld" />
</template>

<script>
import config from 'config'
import { mapGetters } from 'vuex'
import last from 'lodash-es/last'

import JsonLd from './JsonLdContainer'

export default {
  name: 'JsonLdBreadcrumbs',
  components: {
    JsonLd
  },
  computed: {
    ...mapGetters({
      breadcrumbsRoutes: 'breadcrumbs/getBreadcrumbsRoutes',
      breadcrumbsCurrent: 'breadcrumbs/getBreadcrumbsCurrent',
      currentRoute: 'url/getCurrentRoute'
    }),
    paths () {
      let routes = this.breadcrumbsRoutes
      return routes.map((r, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'item': this.createAbsoluteUrl(r.route_link),
        'name': r.name
      }))
    },
    current () {
      if (last(this.breadcrumbsRoutes)?.name !== this.breadcrumbsCurrent) {
        return [{
          '@type': 'ListItem',
          'position': this.breadcrumbsRoutes.length + 1,
          'item': this.createAbsoluteUrl(this.currentRoute?.fullPath),
          'name': this.breadcrumbsCurrent
        }]
      }
      return []
    },
    jsonld () {
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [ ...this.paths, ...this.current ]
      }
    }
  },
  methods: {
    createAbsoluteUrl (path = '') {
      let baseUrl = config.icmaa_cdn?.scalecommerce?.baseUrl || ''
      baseUrl = baseUrl.replace(/\/$/, '')
      return baseUrl + path
    }
  }
}
</script>
