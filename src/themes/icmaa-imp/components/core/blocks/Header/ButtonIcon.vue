<template>
  <button
    class="t-relative t-flex t-cursor-pointer t-items-center t-text-white"
    :aria-label="$t(title)"
    @click="$emit('click')"
  >
    <MaterialIcon
      :icon="icon"
      class="t-flex t-flex-fix"
    />
    <span
      v-show="qty > 0"
      class="qty t-absolute t-flex t-h-3-1/2 t-w-3-1/2 t-items-center t-justify-center t-rounded-full t-border-2 t-border-base-darkest t-bg-alt-3"
    />
    <span
      class="t--ml-1 t-hidden t-text-sm t-text-white lg:t-flex lg:t-flex-auto"
      :class="[last ? 't-mr-4' : 't-mr-2']"
      v-html="$t(title)"
    />
  </button>
</template>

<script>
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'ButtonIcon',
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
    qty: {
      type: Number,
      default: 0
    },
    last: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>

button {

  i {
    width: 50px;
    flex-basis: 50px;
  }

  .qty {
    top: 8px;
    left: 27px;
  }
}

</style>
