<template>
  <div>
    {{ title }}
  </div>
</template>

<script lang="
    ts"
  >
export default {
  name: 'Tabs',
  props: {
    title: {
      type: String,
      required: true
    }
  }

}
</script>
