<template>
  <div class="">
    Filter: {{ test }}
  </div>
</template>

<script>
export default {
  props: {
    test: {
      type: String,
      default: ''
    }
  }
}
</script>
