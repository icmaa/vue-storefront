<template>
  <Sidebar
    class="t-absolute t-top-0"
    :title="sidebar.title"
    :close-icon="sidebar.closeIcon"
  >
    <template #top>
      <TopButton
        icon="keyboard_arrow_left"
        text="Back"
        :tab-index="1"
        class="t-text-base"
        @click.native="close"
      />
    </template>
    <component
      :is="component"
      v-bind="sidebar.props"
      @close="close"
      @reload="getComponent"
    />
  </Sidebar>
</template>

<script>
import { mapGetters } from 'vuex'
import Sidebar from 'theme/components/core/blocks/AsyncSidebar/Sidebar'
import TopButton from 'theme/components/core/blocks/AsyncSidebar/TopButton'
import LoadingSpinner from 'theme/components/core/blocks/AsyncSidebar/LoadingSpinner'
import LoadingError from 'theme/components/core/blocks/AsyncSidebar/LoadingError'

export default {
  name: 'AsyncSidebarSubmenu',
  components: {
    Sidebar,
    TopButton
  },
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
  computed: {
    ...mapGetters({ sidebarPath: 'ui/getSidebarPath' }),
    sidebar () {
      return this.sidebarPath[this.index]
    }
  },
  created () {
    this.getComponent()
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
    close () {
      this.$store.dispatch('ui/removeLastSidebarPath')
      this.$emit('close')
    }
  }
}
</script>
