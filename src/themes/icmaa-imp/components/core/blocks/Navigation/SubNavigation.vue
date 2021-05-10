<template>
  <div v-if="navigation">
    <gender-navigation :items="genderNavigationItems" class="t--mx-4 t--mt-4 t-mb-4" v-if="genderNavigationItems" />
    <div class="t-flex t-flex-wrap t--mx-1">
      <navigation-item v-for="link in mainNavigationItems" v-bind="link" :key="link.id" />
    </div>
    <div
      v-if="navigation && filteredNavigation.length > 0"
      class="t-flex t-flex-wrap t-mb-4"
    >
      <router-link
        v-for="(item, i) in filteredNavigation"
        :key="`nav-${i}`"
        :to="localizedRoute(item.route)"
        class="t-w-full t-py-3 t-px-4 t-border-base-lightest t-text-sm"
        :class="{ 't-border-b': i !== (filteredNavigation.length - 1), 't-font-bold': item.bold }"
        @click.native="closeMenu"
        v-text="item.name"
      />
    </div>
    <div
      v-if="teaser && teaser.length > 0"
      class="t-flex t-flex-wrap"
    >
      <div
        v-for="(t, i) in teaser"
        :key="`${t.route}-${i}`"
        class="t-relative t-w-full t-mb-4 t-overflow-hidden t-rounded-sm"
      >
        <router-link
          :to="t.route"
          v-text="t.name"
          class="t-absolute t-flex t-h-full t-items-center t-justify-center t-text-sm t-text-white t-w-full"
          @click.native="closeMenu"
        />
        <picture-component
          :alt="t.name"
          :src="t.image"
          :width="436"
          :height="228"
          :placeholder="true"
          :sizes="teaserSizes"
          ratio="109:57"
          class="t-flex-1 t-self-start"
        />
      </div>
    </div>
    <div
      v-if="logos"
      class="t-flex t-flex-wrap"
      @click="closeMenu"
    >
      <logo-line
        v-bind="logoLineProps"
        :placeholder="true"
        column-class="t-mb-8"
        class="t-justify-evenly t--mx-4 t--mb-4 t-py-8 t-pb-0 t-bg-base-lightest"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import NavigationItem from 'theme/components/core/blocks/Navigation/Item'
import GenderNavigation from 'theme/components/core/blocks/Navigation/ClusterNavigation'
import LogoLine from 'theme/components/core/blocks/CategoryExtras/LogoLine'
import PictureComponent from 'theme/components/core/blocks/Picture'

export default {
  name: 'SubNavigation',
  components: {
    NavigationItem,
    GenderNavigation,
    LogoLine,
    PictureComponent
  },
  props: {
    subNavigationKey: {
      type: String,
      required: true
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
      return this.mainNavigation.mainNavigation.slice(0, 2) || false
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
    teaser () {
      return this.sub.teaser || false
    },
    teaserSizes () {
      return [
        // Order high-to-low is important
        { media: '(min-width: 768px)', width: 428 },
        { media: '(max-width: 768px)', width: 768 },
        { media: '(max-width: 415px)', width: 415 }
      ]
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
  methods: {
    closeMenu () {
      this.$store.dispatch('ui/closeAll')
    }
  },
  mounted () {
    this.$store.dispatch('icmaaCmsBlock/list', 'navigation-main-sub-' + this.subNavigationKey)
  }
}

</script>
