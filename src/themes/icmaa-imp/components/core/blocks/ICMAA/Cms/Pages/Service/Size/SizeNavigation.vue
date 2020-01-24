<template>
  <div class="t-flex t-items-center t-justify-between t-flex-wrap t-cursor-pointer t-font-bold" @click="toggleView">
    <div>{{ headline }}</div>
    <material-icon :icon="icon" size="lg" class="t-text-base-lighter t-ml-2" />
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
    }
  },
  data () {
    return {
      show: false
    }
  },
  computed: {
    icon () {
      return this.show ? 'expand_less' : 'expand_more'
    }
  },
  methods: {
    toggleView () {
      this.show = !this.show
      this.$emit('toggle', this.show)
    }
  }
}
</script>
