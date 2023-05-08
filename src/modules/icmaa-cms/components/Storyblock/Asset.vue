<template>
  <div>
    {{ image }}
  </div>
</template>

<script lang="ts">
export default {
  name: 'StoryblockAsset',
  props: {
    image: {
      type: Object,
      required: true
    }
  }
}
</script>
