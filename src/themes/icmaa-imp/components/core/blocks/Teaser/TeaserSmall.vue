<template>
  <div
    id="teaser-small"
    class="t-flex t-flex-col md:t-flex-row t-mb-5 t-mx-4"
    :style="{ 'background-color': teaser.background_color }"
  >
    <a :href="teaser.image_link" class="t-w-full md:t-w-1/2 t-mb-8 md:t-mb-0">
      <img class="t-w-full" :src="teaser.image_1x1">
    </a>
    <div class="t-w-2/3 md:t-w-1/2">
      <div class="t-h-full t-pl-8 t-pb-10 md:t-ml-0 md:t-pt-24 lg:t-px-8 lg:t-pt-40">
        <h1
          class="t-w-full t-leading-tight t-font-bold t-text-2.5xl t-mb-5"
          :style="{ color: teaser.text_color }"
        >
          {{ teaser.text_1 }}
        </h1>
        <div
          class="t-w-full t-text-sm t-mb-10"
          :style="{ color: teaser.text_color }"
        >
          {{ teaser.text_2 }}
        </div>
        <div class="lg:t-mb-24">
          <button-outline
            class="t-text-xs t-truncate"
            :link="teaser.image_link"
            :color="teaser.text_color"
          >
            {{ teaser.button_text }}
          </button-outline>
        </div>

        <div
          v-if="teaser.text_3"
          class="t-hidden lg:t-block t-text-sm t-w-full"
          :style="{ color: teaser.text_color }"
        >
          {{ teaser.text_3 }}
        </div>
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
