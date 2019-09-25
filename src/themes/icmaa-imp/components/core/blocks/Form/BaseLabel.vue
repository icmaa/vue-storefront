<template>
  <label :for="formId" class="t-block t-mb-2 t-text-sm">
    {{ labelText }}
  </label>
</template>

<script>
export default {
  name: 'BaseLabel',
  props: {
    formId: {
      type: String,
      required: true
    },
    labelText: {
      type: String,
      required: true
    }
  }
}
</script>
