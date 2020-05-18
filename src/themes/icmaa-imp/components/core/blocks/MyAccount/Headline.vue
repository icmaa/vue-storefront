<template>
  <h1 class="t-flex t-flex-wrap t-items-center t-mt-2 t-mb-6 t-text-2xl t-leading-tight">
    <slot />
  </h1>
</template>

<script>

export default {
  name: 'ProfileHeadline',
  components: {
  },
  props: {
    icon: {
      type: String,
      default: 'account_circle'
    }
  }
}

</script>
