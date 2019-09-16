<template>
  <div id="teaser-large" class="t-w-full t-mb-4">
    <a :href="teaser[0].href" class="">
      <div class="t-relative">
        <img
          class="t-w-full"
          src="assets/teaser/20190603_1x1_teaser_boy_hell_04.webp"
        >
        <div
          class="t-flex t-justify-center t-absolute t-bottom-0 t-inset-x-0 t-mb-6 t-text-sm"
          :style="{ color: teaser[0].title_color }"
        >
          {{ teaser[0].title }}
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
  data () {
    return {
      teaser: [
        {
          title: 'Alle Produkte anzeigen',
          title_color: '#ffffff',
          subtitle: 'Ein tollter Subtitle',
          subtitle_color: '#ffffff',
          href: '/sales.html',
          banner: true
        },
        {
          title: 'Neues Merchandise',
          title_color: 'black',
          subtitle: 'T-Shirts, Hoodies, Shorts uvm. noch viel mehr Sachen ',
          subtitle_color: 'black',
          button_text: 'JETZT SHOPPEN',
          button_text_color: 'black',
          href: '/merchandise.html',
          banner: false
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
