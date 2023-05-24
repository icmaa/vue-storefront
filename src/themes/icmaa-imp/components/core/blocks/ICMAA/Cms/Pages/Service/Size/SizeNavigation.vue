<template>
  <div
    class="t-flex t-cursor-pointer t-flex-wrap t-items-center t-justify-between t-border-b-2 t-py-2 t-font-bold"
    :class="{ 't-border-base-lightest': !show }"
    @click="toggle"
  >
    <div>{{ headline }}</div>
    <material-icon
      :icon="icon"
      size="lg"
      class="t-ml-2 t-text-base-lighter"
    />
  </div>
</template>

<script>
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'ServiceSizeNavigation',
  components: {
    MaterialIcon
  },
  props: {
    headline: {
      required: true,
      type: String
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    icon () {
      return this.show ? 'expand_less' : 'expand_more'
    }
  },
  methods: {
    toggle () {
      this.$emit('toggle', !this.show)
    }
  }
}
</script>
