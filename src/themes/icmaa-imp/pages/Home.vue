<template>
  <div id="home" class="t-container">
    <div
      class="t-min-h-screen t-content-center t-flex-no-wrap t-justify-center"
    >
      <Teaser />
    </div>
  </div>
</template>

<script>
import config from 'config';
import { mapGetters } from 'vuex';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { Logger } from '@vue-storefront/core/lib/logger';
import Teaser from 'theme/components/core/blocks/Teaser/Teaser';

export default {
  components: {
    Teaser
  },
  mounted () {
    if (!this.isLoggedIn && localStorage.getItem('redirect')) {
      this.$bus.$emit('modal-show', 'modal-signup');
    }
  },
  asyncData ({ store, route }) {
    return store.dispatch('icmaaTeaser/list', {
      tag: ['140'],
      cluster: ['4350']
    });
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
