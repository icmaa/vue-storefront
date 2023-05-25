<template>
  <router-link
    v-if="!isExternal"
    :to="to"
  >
    <slot />
  </router-link>
  <a
    v-else
    :href="to"
    target="_blank"
  >
    <slot />
  </a>
</template>

<script>
export default {
  name: 'LinkComponent',
  props: {
    to: {
      type: [String, Object],
      required: true
    }
  },
  computed: {
    isExternal () {
      return typeof this.to === 'string' && this.to.startsWith('http')
    }
  }
}
</script>
