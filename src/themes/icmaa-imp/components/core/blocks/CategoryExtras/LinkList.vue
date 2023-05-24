<template>
  <div class="t--mx-4 t-flex t-flex-wrap t-px-4">
    <h4
      v-if="!!title && title !== ''"
      class="t-mb-4 t-flex t-w-full t-items-center t-justify-between t-px-4 t-text-xl t-text-base-dark"
    >
      {{ title }}
      <span
        class="t-l t-inline-block t-cursor-pointer t-text-xs t-leading-loose t-text-primary"
        @click="openSidebarNavigation"
      >
        {{ $t('View all') }}
      </span>
    </h4>
    <div
      v-for="(item, i) in mappedItems"
      :key="item.text + '-' + i"
      class="t-mb-4 t-flex t-w-1/2 t-px-4 lg:t-w-1/4"
    >
      <router-link
        :to="localizedRoute(item.link)"
        class="t-w-full t-bg-white t-px-4 t-py-3 t-align-middle t-text-sm"
      >
        {{ item.text }}
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LinkList',
  props: {
    title: {
      type: [ Boolean, String ],
      required: false,
      default: false
    },
    items: {
      type: [ Object, Array ],
      required: true
    }
  },
  computed: {
    ...mapGetters({
      gender: 'user/getGender'
    }),
    filteredItems () {
      if (!this.items?.default) {
        return this.items || []
      }

      if (!!this.gender && this.items[this.gender]) {
        return this.items[this.gender]
      } else {
        return this.items.default || []
      }
    },
    mappedItems () {
      return this.filteredItems.map(i => ({ text: i[0], link: i[1] }))
    }
  },
  methods: {
    openSidebarNavigation () {
      this.$store.dispatch('ui/setSidebar', { key: 'sidebar' })
    }
  }
}
</script>
