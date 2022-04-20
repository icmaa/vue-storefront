<template>
  <div class="t-w-full lg:t-w-1/3 t-px-4" data-test-id="LogoLineBlock">
    <h4 class="t-flex t-justify-between t-items-center t-text-xl t-text-base-dark t-mb-4">
      {{ title }}
      <router-link :to="localizedRoute(path)" class="t-inline-block t-l t-text-primary t-text-xs t-leading-loose">
        {{ $t('View all') }}
      </router-link>
    </h4>
    <logo-line :static-items="items" :limit="9" :placeholder="true" column-class="t-w-1/3 lg:t-w-1/3 t-py-2" class="t-justify-between" />
  </div>
</template>

<script>
import LogoLine from 'theme/components/core/blocks/CategoryExtras/LogoLine'

export default {
  name: 'LogolineBlock',
  components: {
    LogoLine
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  }
}
</script>
