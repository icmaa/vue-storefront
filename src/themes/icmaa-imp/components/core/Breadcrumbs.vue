<template>
  <div class="t-flex t-flex-wrap t-items-center t-text-sm t-text-base-tone">
    <template v-for="(link, index) in paths">
      <router-link :to="link.route_link" :key="index" class="t-text-base-tone hover:t-text-base-dark" :class="{ 't-hidden md:t-inline': !link.visible }" v-if="link.route_link">
        <template v-if="index === 0">
          <material-icon icon="home" size="xs" class="t-align-middle" />
          <span class="t-sr-only">{{ link.name | htmlDecode }}</span>
        </template>
        <template v-else>
          {{ link.name | htmlDecode }}
        </template>
      </router-link>
      <span v-else :key="index" class="t-text-base-tone" :class="{ 't-hidden md:t-inline': !link.visible, 'md:t-hidden': link.placeholder }">{{ link.name | htmlDecode }}</span>
      <span class="t-mx-3 lg:t-mx-4 t-text-xs t-font-thin" :class="{ 't-hidden md:t-inline': !link.visible || (!showActiveRoute && link.isLast), 'md:t-hidden': link.placeholder }" :key="'bullet-' + index" v-text="spacerCharacter" />
    </template>
    <span class="t-text-base-tone" :class="{ 't-hidden md:t-inline': !showActiveRoute }">{{ current | htmlDecode }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { localizedRoute } from '@vue-storefront/core/lib/multistore'
import i18n from '@vue-storefront/i18n'
import last from 'lodash-es/last'

import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'Breadcrumbs',
  components: {
    MaterialIcon
  },
  props: {
    activeRoute: {
      type: String,
      default: undefined
    },
    spacerCharacter: {
      type: String,
      default: '/'
    },
    withHomepage: {
      type: Boolean,
      default: true
    },
    showActiveRoute: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  computed: {
    ...mapGetters({
      getBreadcrumbsRoutes: 'breadcrumbs/getBreadcrumbsRoutes',
      getBreadcrumbsCurrent: 'breadcrumbs/getBreadcrumbsCurrent'
    }),
    testLimit () {
      return this.showActiveRoute ? this.limit - 1 : this.limit
    },
    isLong () {
      return this.routes.length > this.testLimit
    },
    routes () {
      let routes = this.getBreadcrumbsRoutes

      // Remove last element – got it already in `current`
      if (routes.length && last(routes).name === this.current) {
        routes = routes.slice(0, -1)
      }

      return routes
    },
    paths () {
      let routes = this.routes
      routes = routes.map((r, i) => {
        return Object.assign(r, {
          isLast: (routes.length === i + 1),
          visible: !this.isLong || (this.isLong && (i + 1) > (routes.length - this.testLimit))
        })
      })

      if (this.isLong) {
        routes.unshift({ name: '…', visible: true, placeholder: true })
      }

      if (this.withHomepage) {
        routes.unshift({ name: i18n.t('Homepage'), route_link: localizedRoute('/'), visible: true })
      }

      return routes
    },
    current () {
      return this.activeRoute || this.getBreadcrumbsCurrent
    }
  }
}
</script>
