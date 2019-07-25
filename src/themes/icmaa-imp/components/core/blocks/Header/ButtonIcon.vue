<template>
  <button class="t-flex t-items-center t-cursor-pointer t-text-white" :aria-label="$t(title)" @click="$emit('click')">
    <material-icon :icon="icon" class="t-flex t-flex-fix" />
    <span v-html="$t(title)" class="t-hidden lg:t-flex-auto lg:t-flex t--ml-1 t-text-white t-text-sm" :class="{ 't-mr-2': !last }" />
  </button>
</template>

<script>
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  components: {
    MaterialIcon
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
    last: Boolean
  }
}
</script>

<style lang="scss" scoped>

button {

  i {
    width: 50px;
    flex-basis: 50px;
  }
}

</style>
