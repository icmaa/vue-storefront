<template>
  <div id="teaser-large" class="t-w-full t-mb-5">
    <a :href="teaser.image_link" class="">
      <div class="t-relative">
        <picture>
          <source
            media="(max-width: 767px)"
            srcset="assets/teaser/20190603_1x1_teaser_boy_hell_04.webp"
          >
          <source
            media="(min-width: 768px)"
            srcset="assets/teaser/20190910_15_uebergangsjacken_desktop_de.webp"
          >
          <img
            class="t-w-full"
            src="assets/teaser/20190910_15_uebergangsjacken_desktop_de.webp"
            alt=""
          >
        </picture>

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
