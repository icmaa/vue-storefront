<template>
  <div>
    <div class="t-flex t-overflow-auto t-hide-scrollbar t-scrolling-touch">
      <span
        v-for="(tab, key) in tabs"
        :key="'pill-' + key"
        class="t-flex-fix t-cursor-pointer t-select-none t-border-b t-px-4 t-pb-3 t-text-sm t-webkit-tap-transparent"
        :class="{ 't-border-primary t-text-primary': isActive(tab), 't-border-base-lightest': !isActive(tab), 't-pl-2': key === 0, 't-mr-2px': tab !== last }"
        @click="setCurrent(tab)"
      >
        <slot :name="'pill-' + tab" />
      </span>
      <span class="t-grow t-border-b t-border-b-base-lightest" />
    </div>
    <div
      v-for="(tab, key) in tabs"
      v-show="isActive(tab)"
      :key="'tab-' + key"
      class="t-pt-8"
    >
      <slot :name="'tab-' + tab" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      current: this.tabs[0]
    }
  },
  computed: {
    last () {
      return this.tabs[this.tabs.length - 1]
    }
  },
  methods: {
    setCurrent (tab) {
      this.current = tab
    },
    isActive (tab) {
      return this.current === tab
    }
  }
}

</script>
