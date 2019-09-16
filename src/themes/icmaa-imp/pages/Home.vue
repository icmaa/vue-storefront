<template>
  <div id="home" class="t-container">
    <div
      class="t-min-h-screen t-content-center t-flex-no-wrap t-justify-center"
    >
      <!-- TEASER LARGE -->
      <Banner />
      <!-- TEASER SMALL -->
      <Teaser />
    </div>
  </div>
</template>

<script>
import config from 'config';
import { mapGetters } from 'vuex';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { Logger } from '@vue-storefront/core/lib/logger';
import Banner from 'theme/components/core/blocks/Teaser/Banner';
import Teaser from 'theme/components/core/blocks/Teaser/Teaser';

export default {
  components: {
    Banner,
    Teaser
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
  },
  created () {
    this.$store.dispatch('checkout/load');
  },
  mounted () {
    if (!this.isLoggedIn && localStorage.getItem('redirect')) {
      this.$bus.$emit('modal-show', 'modal-signup');
    }
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
