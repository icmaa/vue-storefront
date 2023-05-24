<template>
  <div
    class="t-w-full t-px-4 lg:t-w-1/3"
    data-test-id="LogoLineBlock"
  >
    <h4 class="t-mb-4 t-flex t-items-center t-justify-between t-text-xl t-text-base-dark">
      {{ title }}
      <router-link
        :to="localizedRoute(path)"
        class="t-l t-inline-block t-text-xs t-leading-loose t-text-primary"
      >
        {{ $t('View all') }}
      </router-link>
    </h4>
    <logo-line
      :static-items="items"
      :limit="9"
      :placeholder="true"
      column-class="t-w-1/3 lg:t-w-1/3 t-py-2"
      class="t-justify-between"
    />
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
