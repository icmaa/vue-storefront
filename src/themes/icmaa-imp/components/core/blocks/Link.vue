<template>
  <router-link :to="to" v-if="!isExternal">
    <slot />
  </router-link>
  <a :href="to" target="_blank" v-else>
    <slot />
  </a>
</template>

<script>
export default {
  name: 'Link',
  props: [ 'to' ],
  computed: {
    isExternal () {
      return typeof this.to === 'string' && this.to.startsWith('http')
    }
  }
}
</script>
