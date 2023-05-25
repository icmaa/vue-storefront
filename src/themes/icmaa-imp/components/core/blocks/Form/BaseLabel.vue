<template>
  <label
    :for="id"
    class="t-mb-1 t-flex t-w-full t-self-center t-px-1 t-text-sm t-text-base-tone"
    @click="$emit('click', $event)"
  >
    <slot />
  </label>
</template>

<script>
export default {
  name: 'FlaotingLabel',
  props: {
    id: {
      type: String,
      required: true
    }
  }
}
</script>
