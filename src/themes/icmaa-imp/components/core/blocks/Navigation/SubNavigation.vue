<template>
  <div v-if="loading">
    <LoadingSpinner />
  </div>
  <div
    v-else-if="navigation"
    class="t-pb-24"
  >
    <GenderNavigation
      v-if="genderNavigationItems"
      :items="genderNavigationItems"
      class="t--mx-4 t--mt-4 t-mb-4"
    />
    <div class="t--mx-1 t-flex t-flex-wrap">
      <NavigationItem
        v-for="link in mainNavigationItems"
        :key="link.id"
        v-bind="link"
      />
    </div>
    <div
      v-if="navigation && filteredNavigation.length > 0"
      class="t-mb-4 t-flex t-flex-wrap"
    >
      <router-link
        v-for="(item, i) in filteredNavigation"
        :key="`nav-${i}`"
        :to="localizedRoute(item.route)"
        class="t-w-full t-border-base-lightest t-px-4 t-py-3 t-text-sm"
        :class="{ 't-border-b': i !== (filteredNavigation.length - 1) }"
        @click.native="closeMenu"
      >
        {{ item.name }}
      </router-link>
    </div>
    <div
      v-if="logos"
      class="t-flex t-flex-wrap"
      @click="closeMenu"
    >
      <LogoLine
        v-bind="logoLineProps"
        :placeholder="true"
        column-class="t-mb-8"
        class="t--mx-4 t--mb-4 t-justify-evenly t-bg-base-lightest t-py-8 t-pb-0"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import NavigationItem from 'theme/components/core/blocks/Navigation/Item'
import GenderNavigation from 'theme/components/core/blocks/Navigation/ClusterNavigation'
import LogoLine from 'theme/components/core/blocks/CategoryExtras/LogoLine'
import LoadingSpinner from 'theme/components/core/blocks/AsyncSidebar/LoadingSpinner'

export default {
  name: 'SubNavigation',
  components: {
    NavigationItem,
    GenderNavigation,
    LogoLine,
    LoadingSpinner
  },
  props: {
    subNavigationKey: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      'getJsonBlockByIdentifier': 'icmaaCmsBlock/getJsonBlockByIdentifier',
      'currentGender': 'user/getGender'
    }),
    sub () {
      return this.getJsonBlockByIdentifier('navigation-main-sub-' + this.subNavigationKey)
    },
    mainNavigation () {
      return this.getJsonBlockByIdentifier('navigation-main')
    },
    genderNavigationItems () {
      return this.mainNavigation.genderNavigation || false
    },
    mainNavigationItems () {
      return this.tiles || this.mainNavigation.mainNavigation.slice(0, 2) || false
    },
    navigation () {
      return this.sub.navigation || false
    },
    filteredNavigation () {
      if (!this.navigation) return []

      if (!this.currentGender) {
        return this.navigation.filter(n => !n.gender || n.gender === 'non-binary')
      }

      return this.navigation.filter(n => !n.gender || n.gender === this.currentGender)
    },
    tiles () {
      return this.sub.tiles || false
    },
    logos () {
      return this.sub.logos || false
    },
    logoLineProps () {
      if (Array.isArray(this.logos)) {
        return {
          parentId: 0,
          staticItems: this.logos || []
        }
      }

      return {
        parentId: this.logos.parentId,
        limit: this.logos.limit || 6
      }
    }
  },
  async mounted () {
    await this.$store.dispatch('icmaaCmsBlock/list', 'navigation-main-sub-' + this.subNavigationKey)
    this.loading = false
  },
  methods: {
    closeMenu () {
      this.$store.dispatch('ui/closeAll')
    }
  }
}

</script>
