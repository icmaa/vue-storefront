<template>
  <div class="t-px-4 t--mx-4 t-flex t-flex-wrap">
    <h4 v-if="!!title" class="t-w-full t-px-4 t-flex t-justify-between t-items-center t-text-xl t-text-base-dark t-mb-4">
      {{ title }}
      <span class="t-inline-block t-l t-text-primary t-text-xs t-leading-loose t-cursor-pointer" @click="openSidebarNavigation">
        {{ $t('View all') }}
      </span>
    </h4>
    <div
      v-for="(item, i) in mappedItems"
      :key="item.text + '-' + i"
      class="t-flex t-w-1/2 lg:t-w-1/4 t-px-4 t-mb-4"
    >
      <router-link
        :to="localizedRoute(item.link)"
        class="t-px-4 t-py-3 t-w-full t-bg-white t-text-sm t-align-middle"
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
