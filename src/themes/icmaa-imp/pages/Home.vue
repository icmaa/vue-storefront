<template>
  <div id="home" class="t-container">
    <div
      class="t-min-h-screen t-content-center t-flex-no-wrap t-justify-center"
    >
      <!-- TEASER LARGE -->
      <template v-if="teaser.length > 0">
        <Teaser2x1 :teaser="teaser[0]" />
      </template>
      <!-- TEASER SMALL -->
      <template v-if="teaser.length > 0">
        <Teaser1x1 :teaser="teaser[1]" />
      </template>
    </div>
  </div>
</template>

<script>
import config from 'config';
import { mapGetters } from 'vuex';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { Logger } from '@vue-storefront/core/lib/logger';
import Teaser2x1 from 'theme/components/core/blocks/Teaser/Teaser2x1';
import Teaser1x1 from 'theme/components/core/blocks/Teaser/Teaser1x1';

export default {
  components: {
    Teaser2x1,
    Teaser1x1
  },
  data () {
    return {
      teaser: [
        {
          text_1: 'ALLE PRODUKTE ANZEIGEN',
          text_2: 'Ein tollter Subtitle',
          text_3: 'disclaimer',
          button_text: 'JETZT SHOPPEN',
          text_color: '#ffffff',
          background_color: '#000000',
          image_2x1: '',
          image_1x1: '',
          image_link: '/sales.html'
        },
        {
          text_1: 'Neues Merchandise',
          text_2: 'T-Shirts, Hoodies, Shorts uvm. noch viel mehr Sachen*',
          text_3: '*Test Disclaimer mit längerem Text.',
          button_text: 'JETZT SHOPPEN',
          text_color: '#000',
          background_color: '#fff',
          image_2x1: '',
          image_1x1: '',
          image_link: '/merchandise.html'
        }
      ]
    };
  },
  mounted () {
    if (!this.isLoggedIn && localStorage.getItem('redirect')) {
      this.$bus.$emit('modal-show', 'modal-signup');
    }
  },
  asyncData ({ store, route }) {
    return store.dispatch('icmaaTeaser/list', { tag: ['140'], cluster: ['4350'] })
  },
  watch: {
    isLoggedIn () {
      const redirectObj = localStorage.getItem('redirect');
      if (redirectObj) this.$router.push(redirectObj);
      localStorage.removeItem('redirect');
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
