<template>
  <ButtonIcon
    :icon="icon"
    :title="title"
    :qty="quantity"
    data-test-id="ButtonUiSidebar"
    @click="openSidebarNavigation"
  />
</template>

<script>
import { mapState } from 'vuex'
import ButtonIcon from 'theme/components/core/blocks/Header/ButtonIcon'

export default {
  name: 'ButtonUiSidebar',
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
    uiState: {
      type: String,
      required: true
    },
    qtyGetter: {
      type: [String, Boolean],
      default: false
    }
  },
  computed: {
    ...mapState({
      isOpen: function (state) {
        return state.ui[this.uiState]
      }
    }),
    quantity () {
      return this.qtyGetter
        ? Number(this.$store.getters[this.qtyGetter])
        : 0
    }
  },
  methods: {
    openSidebarNavigation () {
      this.$store.dispatch('ui/setSidebar', { key: this.uiState, status: !this.isOpen })
    }
  }
}
</script>
