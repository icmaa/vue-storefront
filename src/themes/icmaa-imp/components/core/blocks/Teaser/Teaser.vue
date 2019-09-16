<template>
  <div id="teaser-small" class="t-flex t-flex-col md:t-flex-row t-mb-4 t-mx-4 md:t-mx-0 t-bg-white">
    <a :href="teaser.href" class="">
      <img
        class="t-w-full md:t-w-1/2 t-mb-8 md:t-mb-0 t-object-contain"
        src="assets/teaser/20190726_summer_sale_1x1_new.webp"
      >
    </a>
    <div class="t-flex t-flex-col t-w-2/3  md:t-w-1/2 t-ml-8 md:t-ml-0 t-mb-10 t-items-start">
      <h1
        class="t-mb-5 t-text-2xl t-leading-tight t-font-bold"
        :style="{ color: teaser.title_color }"
      >
        {{ teaser.title }}
      </h1>
      <div class="t-mb-10 t-text-sm" :style="{ color: teaser.subtitle_color }">
        {{ teaser.subtitle }}
      </div>
      <button-outline :link="teaser.href" color="dark">
        {{ teaser.button_text }}
      </button-outline>
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
    teaser: Object
  }
};
</script>

<style lang="scss" scoped>
</style>
