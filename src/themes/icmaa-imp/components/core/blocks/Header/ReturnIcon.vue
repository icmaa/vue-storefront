<template>
  <button
    type="button"
    class="inline-flex brdr-none"
    data-test-id="ReturnIcon"
    @click="goBack"
  >
    <i class="material-icons">keyboard_backspace</i>
  </button>
</template>

<script>
import ReturnIcon from '@vue-storefront/core/compatibility/components/blocks/Header/ReturnIcon'

export default {
  name: 'ReturnIcon',
  mixins: [ReturnIcon]
}
</script>
