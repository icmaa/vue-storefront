<template>
  <div id="teaser-large" class="t-w-full t-mb-4">
    <a :href="teaser.href" class="">
      <div class="t-relative">
        <img
          class="t-w-full"
          src="assets/teaser/20190603_1x1_teaser_boy_hell_04.webp"
        >
        <div
          class="t-flex t-justify-center t-absolute t-bottom-0 t-inset-x-0 t-mb-6 t-text-sm"
          :style="{ color: teaser.text_color }"
        >
          {{ teaser.text_1 }}
          <material-icon icon="arrow_forward" class="t-ml-3" />
        </div>
      </div>
    </a>
  </div>
</template>

<script>
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon';

export default {
  components: {
    MaterialIcon
  },
  props: {
      teaser: Object
  }
};
</script>

<style lang="scss" scoped>
</style>
