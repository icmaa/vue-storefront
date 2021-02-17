<template>
  <h1 class="t-px-4 t-text-2xl t-font-medium t-leading-5" v-text="headline" />
</template>

<script>

export default {
  name: 'Headline',
  props: {
    headline: {
      type: String,
      required: true
    }
  }
}
</script>
