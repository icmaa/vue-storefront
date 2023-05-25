<template>
  <div
    v-if="editUrl"
    class="t-absolute t-top-0 t-mt-2"
  >
    <a
      :href="editUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="t-block t-bg-white t-p-2 t-font-mono t-text-xs t-text-base-tone"
      @click.stop="/** Don't call parent redirect */"
    >
      <MaterialIcon
        icon="edit"
        size="lg"
        class="t-align-middle"
      />
    </a>
  </div>
</template>

<script>

import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'TeaserEditButton',
  components: {
    MaterialIcon
  },
  props: {
    editUrl: {
      type: [String, Boolean],
      default: false
    }
  }
}
</script>
