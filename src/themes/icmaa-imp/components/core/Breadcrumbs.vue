<template>
  <div class="t-flex t-flex-wrap t-items-center t-text-sm t-text-base-tone">
    <template v-for="(link, index) in paths">
      <router-link
        v-if="link.route_link"
        :key="index"
        :to="link.route_link"
        class="t-text-base-tone hover:t-text-base-dark"
        :class="{ 't-hidden md:t-inline': !link.visible }"
      >
        <template v-if="index === 0">
          <MaterialIcon
            icon="home"
            size="xs"
            class="t-align-middle"
          />
          <span class="t-sr-only">{{ link.name | htmlDecode }}</span>
        </template>
        <template v-else>
          {{ link.name | htmlDecode }}
        </template>
      </router-link>
      <span
        v-else
        :key="index"
        class="t-text-base-tone"
        :class="{ 't-hidden md:t-inline': !link.visible, 'md:t-hidden': link.placeholder }"
      >{{ link.name | htmlDecode }}</span>
      <span
        :key="'bullet-' + index"
        class="t-mx-3 t-text-xs t-font-extralight lg:t-mx-4"
        :class="{ 't-hidden md:t-inline': !link.visible || (!showActiveRoute && link.isLast), 'md:t-hidden': link.placeholder }"
        v-text="spacerCharacter"
      />
    </template>
    <span
      class="t-text-base-tone"
      :class="{ 't-hidden md:t-inline': !showActiveRoute }"
    >{{ current | htmlDecode }}</span>
    <JsonLdLoader type="breadcrumbs" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'
import last from 'lodash-es/last'

import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import JsonLdLoader from 'icmaa-google-tag-manager/components/jsonld/JsonLdLoader'

export default {
  name: 'Breadcrumbs',
  components: {
    MaterialIcon,
    JsonLdLoader
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
      breadcrumbsRoutes: 'breadcrumbs/getBreadcrumbsRoutes',
      breadcrumbsCurrent: 'breadcrumbs/getBreadcrumbsCurrent'
    }),
    testLimit () {
      return this.showActiveRoute ? this.limit - 1 : this.limit
    },
    isLong () {
      return this.routes.length > this.testLimit
    },
    routes () {
      let routes = this.breadcrumbsRoutes

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
        routes.unshift({ name: i18n.t('Homepage'), route_link: this.localizedHomeRoute, visible: true })
      }

      return routes
    },
    current () {
      return this.activeRoute || this.breadcrumbsCurrent
    }
  }
}
</script>
