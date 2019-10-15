<template>
  <div class="t-absolute t-top-0 t-w-full" :style="{ left: `${(index + 1) * 100}%` }">
    {{ index }}
    <div @click="back">
      Go back
    </div>
    <component :is="component" @close="$emit('close')" @reload="getComponent" v-bind="sidebar" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LoadingSpinner from 'theme/components/theme/blocks/AsyncSidebar/LoadingSpinner.vue'
import LoadingError from 'theme/components/theme/blocks/AsyncSidebar/LoadingError.vue'

export default {
  props: {
    index: {
      type: Number,
      required: true
    },
    asyncComponent: {
      type: Function,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      component: null
    }
  },
  created () {
    this.getComponent()
  },
  computed: {
    ...mapGetters({ sidebarPath: 'ui/getSidebarPath' }),
    sidebar () {
      return this.sidebarPath[this.index]
    }
  },
  methods: {
    getComponent () {
      this.component = () => ({
        component: this.asyncComponent(),
        loading: LoadingSpinner,
        error: LoadingError,
        timeout: 3000
      })
    },
    back () {
      this.$store.dispatch('ui/removeSidebarPath')
    }
  }
}
</script>
