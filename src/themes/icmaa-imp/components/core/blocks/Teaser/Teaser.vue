<template>
  <div id="teaser-small" class="t-flex t-flex-col t-mb-4 t-mx-4 t-bg-white">
    <a :href="teaser[1].href" class="t-mb-8">
      <img
        class="t-w-full"
        src="assets/teaser/20190726_summer_sale_1x1_new.webp"
      >
    </a>
    <div class="t-flex t-flex-col t-w-2/3 t-ml-8 t-mb-10 t-items-start">
      <h1
        class="t-mb-5 t-text-2xl t-leading-tight t-font-bold"
        :style="{ color: teaser[1].title_color }"
      >
        {{ teaser[1].title }}
      </h1>
      <div
        class="t-mb-10 t-text-sm"
        :style="{ color: teaser[1].subtitle_color }"
      >
        {{ teaser[1].subtitle }}
      </div>
      <button-outline :link="teaser[1].href" color="dark">
        {{ teaser[1].button_text }}
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
