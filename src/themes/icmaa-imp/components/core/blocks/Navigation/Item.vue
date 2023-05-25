<template>
  <div
    class="t-flex t-flex-fix t-flex-wrap t-content-center t-justify-center"
    :class="[ widthClass, { 't-mb-2': marginBottom } ]"
  >
    <template v-if="!hasChildren">
      <router-link
        :to="localizedRoute(route)"
        :title="name | htmlDecode"
        class="t-mx-1 t-flex t-h-full t-w-full t-cursor-pointer t-flex-wrap t-items-center t-justify-center t-rounded-sm t-text-center t-text-sm"
        :class="[ icon ? 't-py-2' : 't-py-4', backgroundColorClass, textColorClass, backgroundImageClass ]"
        :style="[ backgroundImageStyle ]"
        :event="!hasSubNavigation ? 'click' : ''"
        @click.native="click"
      >
        <template v-if="icon">
          <MaterialIcon
            v-bind="{ icon, iconSet }"
            size="sm"
          />
          <span class="t-mt-1 t-block t-w-full t-text-xxs">
            {{ name }}
          </span>
        </template>
        <template v-else>
          {{ name }}
        </template>
      </router-link>
    </template>
    <NavigationItem
      v-for="(child, index) in children"
      :key="index"
      v-bind="child"
      :level="level + 1"
    />
  </div>
</template>

<script>
import NavigationItem from 'theme/components/core/blocks/Navigation/Item'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

const AsyncSubNavigation = () => import(/* webpackChunkName: "vsf-navigation-sub" */ 'theme/components/core/blocks/Navigation/SubNavigation')

export default {
  name: 'NavigationItem',
  components: {
    NavigationItem,
    MaterialIcon
  },
  props: {
    level: {
      type: Number,
      default: 0
    },
    name: {
      type: [String],
      default: ''
    },
    route: {
      type: [Object, String],
      default: ''
    },
    sub: {
      type: [Boolean, String],
      default: false
    },
    width: {
      type: String,
      default: '1/2'
    },
    backgroundColor: {
      type: String,
      default: 'base-lightest'
    },
    backgroundImage: {
      type: [String, Boolean],
      default: false
    },
    icon: {
      type: [String, Boolean],
      default: false
    },
    iconSet: {
      type: [String],
      default: undefined
    },
    children: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    hasChildren () {
      return this.children.length > 0
    },
    hasSubNavigation () {
      return !!this.sub
    },
    widthClass () {
      return 't-w-' + this.width
    },
    backgroundColorClass () {
      return 't-bg-' + this.backgroundColor
    },
    hasBackgroundImage () {
      return (this.backgroundImage)
    },
    backgroundImageStyle () {
      if (!this.hasBackgroundImage) {
        return {}
      }

      return {
        backgroundImage: 'url(' + this.getMediaThumbnail(this.backgroundImage, 0, 0) + ')',
        backgroundBlendMode: 'multiply'
      }
    },
    backgroundImageClass () {
      return this.hasBackgroundImage ? 't-bg-center t-bg-cover' : ''
    },
    marginBottom () {
      return !this.hasChildren
    },
    textColorClass () {
      return this.backgroundColor !== 'base-lightest' || this.hasBackgroundImage ? 't-text-white' : 't-text-base-dark'
    },
    genderNavigationItems () {
      return this.mainNavigation.genderNavigation
    }
  },
  methods: {
    click (e) {
      if (this.hasSubNavigation) {
        const sidebarProps = { title: this.name }
        const sidebar = { component: AsyncSubNavigation, ...sidebarProps, props: { subNavigationKey: this.sub } }
        this.$store.dispatch('ui/addSidebarPath', { sidebar })
      } else {
        this.$store.dispatch('ui/closeAll')
      }
    }
  }
}
</script>
