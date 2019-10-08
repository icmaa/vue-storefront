<template>
  <div id="teaser-large" class="t-w-full t-mb-5">
    <a :href="teaser.image_link" class="">
      <div class="t-relative">
        <picture>
          <source
            media="(max-width: 767px)"
            :srcset="teaser.image_1x1"
          >
          <source
            media="(min-width: 768px)"
            :srcset="teaser.image_2x1"
          >
          <img
            class="t-w-full"
            :src="teaser.image_1x1"
            alt=""
          >
        </picture>

        <div
          class="t-flex t-justify-center t-absolute t-bottom-0 t-inset-x-0 t-mb-6 t-text-sm text-12"
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
    teaser: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.text-12 {
  font-size: 12px;
}
</style>
