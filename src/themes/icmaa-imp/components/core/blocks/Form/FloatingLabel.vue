<template>
  <label
    :for="id"
    class="t-absolute t-cursor-pointer t-text-sm"
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

<style lang="scss">

.floating-label {
  > label {
    top: calc(1.25rem - 0.4em);
    left: calc(.9em);
    line-height: 1em;
    @apply t-opacity-60;
    transition: opacity .1s ease-in-out, transform .1s ease-in-out;
  }

  input::placeholder,
  textarea::placeholder {
    @apply t-text-transparent;
  }

  input:focus, input:not(:placeholder-shown),
  textarea:focus, textarea:not(:placeholder-shown),
  select.value-selected {

    &  ~ label {
      @apply t-opacity-100 t-bg-white;
      left: calc(.9em - 5px);
      padding: 0 5px 0;
      transform-origin: top left;
      transform: scale(.75) translate(0, calc(-2rem + 2px));
    }
  }
}

</style>
