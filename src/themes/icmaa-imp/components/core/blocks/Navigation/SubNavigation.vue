<template>
  <div v-if="navigation">
    <gender-navigation :items="genderNavigationItems" class="t--mx-4 t--mt-4 t-mb-4" />
    <div
      v-if="navigation.navigation && navigation.navigation.length"
      class="t-flex t-flex-wrap t-mb-6"
    >
      <router-link
        v-for="(item, i) in navigation.navigation"
        :key="`nav-${i}`"
        :to="localizedRoute(item.route)"
        class="t-w-full t-py-2 t-px-4 t-border-b t-border-base-lightest t-text-sm"
        :class="{ 't-font-bold': item.bold }"
        v-text="item.name"
      />
    </div>
    {{ navigation }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GenderNavigation from 'theme/components/core/blocks/Navigation/ClusterNavigation'

export default {
  name: 'SubNavigation',
  components: {
    GenderNavigation
  },
  props: {
    subNavigationKey: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      'getJsonBlockByIdentifier': 'icmaaCmsBlock/getJsonBlockByIdentifier'
    }),
    mainNavigation () {
      return this.getJsonBlockByIdentifier('navigation-main')
    },
    genderNavigationItems () {
      return this.mainNavigation.genderNavigation
    },
    navigation () {
      return this.mainNavigation.subNavigation[this.subNavigationKey] || false
    }
  }
}

</script>
