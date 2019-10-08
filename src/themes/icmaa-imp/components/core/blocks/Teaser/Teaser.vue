<template>
  <div id="teaser">
    <TeaserLarge
      v-for="(teaser, index) in teaserLarge"
      :teaser="teaser"
      :key="index"
    />

    <TeaserSmall
      v-for="(teaser, index) in teaserSmall"
      :teaser="teaser"
      :key="index"
    />
  </div>
</template>

<script>
import TeaserLarge from 'theme/components/core/blocks/Teaser/TeaserLarge';
import TeaserSmall from 'theme/components/core/blocks/Teaser/TeaserSmall';

export default {
  components: {
    TeaserLarge,
    TeaserSmall
  },
  data () {
    return {
      teaserLarge: [
        {
          text_1: 'ALLE PRODUKTE ANZEIGEN',
          text_2: 'Ein tollter Subtitle',
          text_3: 'disclaimer',
          button_text: 'JETZT SHOPPEN',
          text_color: '#ffffff',
          background_color: '#000000',
          image_2x1:
            'assets/teaser/20190910_15_uebergangsjacken_desktop_de.webp',
          image_1x1:
            'assets/teaser/20190910_15_uebergangsjacken_desktop_de1x1.webp',
          image_link: '/sales.html',
          teaser_size: 'large'
        }
      ],
      teaserSmall: [
        {
          text_1: 'Neues Merchandise',
          text_2: 'T-Shirts, Hoodies, Shorts uvm. noch viel mehr Sachen*',
          text_3: '*Test Disclaimer mit längerem Text.',
          button_text: 'JETZT SHOPPEN',
          text_color: '#000',
          background_color: '#fff',
          image_2x1: '',
          image_1x1: 'assets/teaser/20190726_summer_sale_1x1_new.webp',
          image_link: '/merchandise.html',
          teaser_size: 'small'
        },
        {
          text_1: 'Eine längere aussagekräftige Headline',
          text_2: 'Dann noch eine Subheadline. (optional)',
          text_3:
            'Falls notwendig ist hier auch eine Möglichkeit für eine Fußnote. (optional)',
          button_text: 'JETZT SHOPPEN',
          text_color: '#000',
          background_color: '#fff',
          image_2x1: '',
          image_1x1: 'assets/teaser/20190603_1x1_teaser_boy_hell_04.webp',
          image_link: '/merchandise.html',
          teaser_size: 'small'
        }
      ]
    };
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
