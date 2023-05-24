<template>
  <nav
    role="meta-navigation"
    class="t-hidden t-items-center t-pr-10 md:t-flex"
  >
    <template v-for="(link, index) in navigation">
      <router-link
        v-if="link.isRoute === true"
        :key="index"
        :to="localizedRoute(link.route)"
        class="t-flex t-text-sm t-text-base-dark"
        :title="link.name | htmlDecode"
      >
        {{ link.name }}
      </router-link>
      <a
        v-else
        :key="index"
        :href="link.route"
        class="t-flex t-text-sm t-text-base-dark"
        target="_blank"
        rel="noopener noreferrer"
        :title="link.name | htmlDecode"
      >
        {{ link.name }}
      </a>
      <span
        v-if="index !== navigation.length - 1"
        :key="'bullet-' + index"
        class="t-flex t-px-3 t-text-sm t-text-base-lighter"
      >&bull;</span>
    </template>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('icmaaCmsBlock', ['getJsonBlockByIdentifier']),
    cmsData () {
      return this.getJsonBlockByIdentifier('navigation-meta')
    },
    navigation () {
      return this.cmsData ? this.cmsData.map(link =>
        Object.assign(link, { isRoute: (typeof link.route === 'object' || link.route.startsWith('/')) })
      ) : []
    }
  }
}
</script>
