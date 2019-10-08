<template>
  <div
    id="teaser-small"
    class="t-flex t-flex-col md:t-flex-row t-mb-5 t-mx-4 md:t-mx-0"
    :style="{ 'background-color': teaser.background_color }"
  >
    <a :href="teaser.image_link" class="t-w-full md:t-w-1/2 t-mb-8 md:t-mb-0">
      <img
        class="t-w-full"
        :src="teaser.image_1x1"
      >
    </a>
    <div
      class="t-flex t-flex-col t-items-start t-w-2/3 md:t-w-1/2 t-ml-8 md:t-ml-0 t-mb-10 md:t-pt-24 md:t-pl-6 lg:t-pt-56"
    >
      <h1
        class="t-mb-5 t-text-2xl t-leading-tight t-font-bold text-26"
        :style="{ color: teaser.text_color }"
      >
        {{ teaser.text_1 }}
      </h1>
      <div class="t-text-sm t-mb-10 text-14" :style="{ color: teaser.text_color }">
        {{ teaser.text_2 }}
      </div>
      <button-outline
        class="t-mb-5 md:t-mb-12 text-12"
        :link="teaser.image_link"
        :color="teaser.text_color"
      >
        {{ teaser.button_text }}
      </button-outline>

      <div
        v-if="teaser.text_3"
        class="t-text-xs text-14"
        :style="{ color: teaser.text_color }"
      >
        {{ teaser.text_3 }}
      </div>
    </div>
  </div>
</template>

<script>
import ButtonOutline from 'theme/components/theme/ButtonOutline';

export default {
  components: {
    ButtonOutline
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
.text-26 {
  font-size: 26px;
}
.text-14 {
  font-size: 14px;
}

.text-12 {
  font-size: 12px;
}
</style>
