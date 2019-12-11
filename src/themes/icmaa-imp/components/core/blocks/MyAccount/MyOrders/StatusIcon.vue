<template>
  <div class="t-flex t-items-center" :class="status">
    <material-icon icon="lens" size="sm" class="t-mr-1" />
    <slot />
  </div>
</template>

<script>
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'StatusIcon',
  components: {
    MaterialIcon
  },
  props: {
    status: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss">

.canceled {
  color: gray;
}

.pending {
  color: #b20a0e;
}

.processing {
  color: #f7c603;
}

.complete {
  color: #297825;
}

.preorder {
  background-color: #006ea1;
}
</style>
