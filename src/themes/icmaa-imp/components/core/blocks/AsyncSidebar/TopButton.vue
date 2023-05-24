<template>
  <button class="t-flex t-flex-fix t-cursor-pointer t-px-2">
    <material-icon :icon="icon" />
    <span
      class="t-sr-only t-sr-only-focusable"
      tabindex="0"
      :text="$t(text)"
    />
  </button>
</template>

<script>
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'TopButton',
  components: {
    MaterialIcon
  },
  props: {
    icon: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>
