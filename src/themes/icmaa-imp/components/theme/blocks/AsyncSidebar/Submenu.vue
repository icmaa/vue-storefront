<template>
  <div class="t-absolute t-top-0 t-w-full" :style="{ left: `${(index + 1) * 100}%` }">
    {{ index }} - {{ sidebar }}
    <div @click="back">
      Go back
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    index: {
      type: Number,
      required: true
    },
    sidebar: {
      type: [Object, String],
      required: true
    }
  },
  computed: {
    ...mapGetters({
      sidebarPath: 'ui/getSidebarPath'
    })
  },
  methods: {
    back () {
      this.$store.dispatch('ui/removeSidebarPath')
    }
  }
}
</script>
