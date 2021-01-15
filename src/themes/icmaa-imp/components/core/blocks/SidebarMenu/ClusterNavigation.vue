<template>
  <div
    class="t-h-32 t-pb-4 t-bg-base-lightest t-flex t-items-end t-justify-evenly t-bg-cover t-bg-no-repeat t-bg-center"
    :style="`background-image: url(${backgroundImage})`"
  >
    <div
      v-for="(item, i) in filteredItems"
      :key="`${attributeCode}-${i}`"
      class="t-cursor-pointer"
    >
      <router-link
        :to="localizedRoute(item.route)"
        @click.native="setSessionValue(item[attributeCode])"
        class="t-block t-bg-white t-px-3 t-pt-1 t-pb-2"
      >
        <span
          class="t-font-black t-text-sm t-uppercase t-border-b-2"
          :class="{
            't-text-base-tone': item[attributeCode] !== false,
            't-border-primary': current !== false && item[attributeCode] === current,
            't-text-base-light': item[attributeCode] !== current && current !== false
          }"
          v-text="item.label"
        />
      </router-link>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'ClusterNavigation',
  props: {
    attributeCode: {
      type: String,
      default: 'gender'
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters({
      'getSessionData': 'user/getSessionData'
    }),
    current () {
      return this.getSessionData(this.attributeCode)
    },
    filteredItems () {
      if (this.current === false) {
        return this.items.filter(i => i.current !== false)
      }

      return this.items
    },
    currentNavigationItem () {
      return this.items.find(i => i[this.attributeCode] === this.current)
    },
    backgroundImage () {
      return this.getMediaThumbnail(this.currentNavigationItem.background, 920, 920)
    }
  },
  methods: {
    setSessionValue (value) {
      if (value === false) {
        this.$store.dispatch('user/removeSessionData', this.attributeCode)
      } else {
        this.$store.dispatch('user/addSessionData', { key: this.attributeCode, value })
      }
    }
  }
}
</script>
