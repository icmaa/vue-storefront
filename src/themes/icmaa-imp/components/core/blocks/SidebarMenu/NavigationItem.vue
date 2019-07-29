<template>
  <div class="t-flex t-flex-wrap t-flex-fix t-content-center t-justify-center" :class="[ widthClass, { 't-mb-2': marginBottom } ]">
    <router-link v-if="!hasChildren" :to="localizedRoute(route)" class="t-cursor-pointer t-rounded-sm t-py-4 t-flex t-mx-1 t-w-full t-h-full t-text-center t-justify-center t-items-center t-text-sm" :class="[ backgroundColorClass, textColorClass ]">
      <template v-if="icon">
        <material-icon :icon="icon" />
        <span class="t-sr-only t-sr-only-focusable">{{ name }}</span>
      </template>
      <template v-else>
        {{ name }}
      </template>
    </router-link>
    <navigation-item v-for="(child, index) in children" v-bind="child" :level="level + 1" :key="index" />
  </div>
</template>

<script>
import NavigationItem from 'theme/components/core/blocks/SidebarMenu/NavigationItem'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

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
    width: {
      type: String,
      default: '1/2'
    },
    backgroundColor: {
      type: String,
      default: 'base-lightest'
    },
    icon: {
      type: [String, Boolean],
      default: false
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
    widthClass () {
      return 't-w-' + this.width
    },
    backgroundColorClass () {
      return 't-bg-' + this.backgroundColor
    },
    marginBottom () {
      return !this.hasChildren
    },
    textColorClass () {
      return this.backgroundColor !== 'base-lightest' ? 't-text-white' : ''
    }
  }
}
</script>
