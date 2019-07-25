<template>
  <button-icon :icon="icon" :title="title" @click="openSidebarMenu" />
</template>

<script>
import { mapState } from 'vuex'
import { Logger } from '@vue-storefront/core/lib/logger';
import ButtonIcon from 'theme/components/core/blocks/Header/ButtonIcon'

export default {
  components: {
    ButtonIcon
  },
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    uiStateName: {
      type: String,
      required: true
    },
    uiMutationName: {
      type: String,
      required: true
    },
    last: Boolean
  },
  computed: mapState({
    isOpen: function (state) {
      return state.ui[this.uiStateName]
    }
  }),
  methods: {
    openSidebarMenu () {
      this.$store.commit('ui/' + this.uiMutationName, !this.isOpen)
    }
  }
}
</script>
