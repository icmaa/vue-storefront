<template>
  <label
    :for="id"
    @click="$emit('click', $event)"
    class="t-w-full t-flex t-self-center t-mb-1 t-px-1 t-text-base-tone t-text-sm"
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
