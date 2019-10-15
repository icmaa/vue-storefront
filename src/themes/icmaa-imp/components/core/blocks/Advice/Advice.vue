<template>
  <transition name="fade">
    <div
      class="t-flex t-w-full row-01 t-items-center t-justify-center"
      style="background-color: #3D9FA5; color:white"
      id="advice"
      v-if="advice && isOpen"
    >
      <div>{{ advice.text }}</div>
      <button-component
        class="t-justify-end"
        type="transparent-white"
        icon="close"
        :icon-only="true"
        @click.native="close"
      >
        {{ $t("Close") }}
      </button-component>

      <div />
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import i18n from '@vue-storefront/i18n';
import { onlineHelper } from '@vue-storefront/core/helpers';
import ButtonComponent from 'theme/components/core/blocks/Button';

export default {
  components: {
    ButtonComponent
  },
  data () {
    return {
      isOpen: true,
      text: '10% Rabatt auf das gesamte Sortiment'
    };
  },
  methods: {
    close () {
      this.isOpen = false;
    }
  },
  computed: {
    ...mapGetters('icmaaAdvice', ['getSingleAdvice']),
    advice () {
      return this.getSingleAdvice;
    }
  },
  mounted () {
    this.$store.dispatch('icmaaAdvice/list');
  }
};
</script>

<style lang="scss" scoped>
.row-01 {
  height: 50px;
}
</style>
