<template>
  <div v-if="navigation">
    <gender-navigation :items="genderNavigationItems" class="t--mx-4 t--mt-4 t-mb-4" v-if="genderNavigationItems" />
    <div
      v-if="navigation && navigation.length > 0"
      class="t-flex t-flex-wrap t-mb-6"
    >
      <router-link
        v-for="(item, i) in navigation"
        :key="`nav-${i}`"
        :to="localizedRoute(item.route)"
        class="t-w-full t-py-2 t-px-4 t-border-b t-border-base-lightest t-text-sm"
        :class="{ 't-font-bold': item.bold }"
        v-text="item.name"
      />
    </div>
    <div
      v-if="teaser && teaser.length > 0"
      class="t-flex t-flex-wrap t-mb-6"
    >
      <router-link
        v-for="(item, i) in teaser"
        :key="`nav-${i}`"
        :to="localizedRoute(item.route)"
        class="t-w-full t-py-2 t-px-4 t-border-b t-border-base-lightest t-text-sm"
        :class="{ 't-font-bold': item.bold }"
        v-text="item.name"
      />
    </div>
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
    navigationDTO () {
      return this.getJsonBlockByIdentifier('navigation-main-sub')
    },
    genderNavigationItems () {
      return this.getJsonBlockByIdentifier('navigation-main').genderNavigation || false
    },
    sub () {
      return this.navigationDTO[this.subNavigationKey] || false
    },
    navigation () {
      return this.sub.navigation || false
    },
    teaser () {
      return this.sub.teaser || false
    },
    logos () {
      return this.sub.logos || false
    }
  }
}

</script>
