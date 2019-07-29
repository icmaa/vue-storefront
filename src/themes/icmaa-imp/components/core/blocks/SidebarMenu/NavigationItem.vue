<template>
  <div class="t-flex t-flex-wrap t-flex-fix t-content-center t-justify-center" :class="[ widthClass, { 't-mb-2': marginBottom } ]">
    <router-link :to="localizedRoute(link.route)" class="t-cursor-pointer t-py-4 t-flex t-mx-1 t-w-full t-h-full t-text-center t-justify-center t-items-center t-text-sm" :class="[ backgroundColorClass, textColorClass ]" v-if="!hasChildren">
      {{ link.name }}
    </router-link>
    <template v-if="hasChildren">
      <navigation-item v-for="(subLink, index) in children" :link="subLink" :width="subLink.width" :background-color="subLink.backgroundColor" :key="index" />
    </template>
  </div>
</template>

<script>
import NavigationItem from 'theme/components/core/blocks/SidebarMenu/NavigationItem'

export default {
  name: 'NavigationItem',
  props: {
    link: {
      type: Object,
      required: true
    },
    width: {
      type: String,
      default: '1/2'
    },
    backgroundColor: {
      type: String,
      default: 'base-lightest'
    }
  },
  computed: {
    children () {
      return this.link.children
    },
    hasChildren () {
      return this.link.hasOwnProperty('children') && this.link.children
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
