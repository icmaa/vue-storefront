<template>
  <div id="home" class="t-container">
    <div
      class="t-min-h-screen t-content-center t-flex-no-wrap t-justify-center"
    >
      <!-- TEASER LARGE -->
      <div id="teaser-large" class="t-w-full t-relative t-content-center t-items-center t-mb-4">
        <a :href="teaser[0].href" class="">
          <img
            class="t-w-full"
            src="assets/teaser/20190603_1x1_teaser_boy_hell_04.webp"
          >
        </a>
        <div class="t-absolute t-bottom-0 t-text-center t-inset-x-0 t-mb-6" v-bind:style="{color: teaser[0].title_color}">
            {{ teaser[0].title }}
          </div>
      </div>


      <!-- TEASER SMALL -->
      <div
        id="teaser-small"
        class="t-flex t-flex-col t-items-center t-mb-4 t-mx-3 t-bg-white"
      >
        <a :href="teaser[1].href" class="t-mx-2 t-mb-2">
          <img class="" src="assets/teaser/20190726_summer_sale_1x1_new.webp" />
        </a>
        <div class="t-text-center t-mb-2" v-bind:style="{color: teaser[1].title_color}">
          {{ teaser[1].title }}
        </div>
        <div class="t-text-center t-mb-3" v-bind:style="{color: teaser[1].subtitle_color}">
          {{ teaser[1].subtitle }}
        </div>
      </div>
      <lazy-hydrate :trigger-hydration="!loading" v-if="isLazyHydrateEnabled">
        <product-listing columns="4" :products="getCategoryProducts" />
      </lazy-hydrate>
      <product-listing v-else columns="4" :products="getCategoryProducts" />
    </div>
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration';
import config from 'config';
import { mapGetters } from 'vuex';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { Logger } from '@vue-storefront/core/lib/logger';
import ProductListing from '../components/core/ProductListing.vue';

export default {
  components: {
    LazyHydrate,
    ProductListing
  },
  data() {
    return {
      teaser: [
        {
          title: 'Hier klicken',
          title_color: '#ffffff',
          subtitle: 'Ein tollter Subtitle',
          subtitle_color: '#ffffff',
          href: '/sales.html'
        },
        {
          title: 'Merchandise',
          title_color: 'black',
          subtitle: 'Ein tollter Subtitle #2',
          subtitle_color: 'blue',
          href: '/merchandise.html'
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      user: 'isLoggedIn',
      getCategoryProducts: 'category-next/getCategoryProducts'
    })
  },
  created() {
    this.$store.dispatch('checkout/load');
  },
  mounted() {
    if (!this.isLoggedIn && localStorage.getItem('redirect'))
      this.$bus.$emit('modal-show', 'modal-signup');
  },
  isLazyHydrateEnabled() {
    return config.products.lazyLoadingCategoryProducts;
  },
  watch: {
    isLoggedIn() {
      const redirectObj = localStorage.getItem('redirect');
      if (redirectObj) this.$router.push(redirectObj);
      localStorage.removeItem('redirect');
    }
  }
};
</script>

<style lang="css" >
:root {
  --greyish-brown: #3e3e3e;
}
.bg-custom-color {
  background-color: var(--greyish-brown);
}
.font-heading {
  font-weight: bold;
}
.font-base-style {
  font-family: Roboto;
  color: #ffffff;
}
font-black-style {
  font-family: Roboto;
}
</style>
