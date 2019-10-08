<template>
  <div id="home" class="t-container">
    <div
      class="t-min-h-screen t-content-center t-flex-no-wrap t-justify-center"
    >
      <teaser tags="2" />
    </div>
  </div>
</template>

<script>
import config from 'config';
import { mapGetters } from 'vuex';
import { onlineHelper } from '@vue-storefront/core/helpers';

import Teaser from 'theme/components/core/blocks/Teaser/Teaser';

export default {
  components: {
    Teaser
  },
  mounted () {
    if (!this.isLoggedIn && localStorage.getItem('redirect')) {
      this.$bus.$emit('modal-show', 'modal-signup');
    }
  }
};
</script>
