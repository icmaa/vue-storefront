<template>
  <div class="t-container">
    <div class="t-flex t-flex-wrap t-py-4">
      <Navigation class="service-navigation t-mb-4 t-w-full t-px-4 lg:t-mt-4 lg:t-w-2/12" />
      <div class="cms-page-rte t-w-full t-px-4 lg:t-w-10/12">
        <div class="t-bg-white t-p-4 lg:t-p-8">
          <h1
            v-if="headline"
            class="t-mb-3 t-text-2xl t-font-medium"
            v-html="headline"
          />
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Navigation'

export default {
  name: 'ServiceLayout',
  components: {
    Navigation
  },
  props: {
    headline: {
      type: [String, Boolean],
      default: false
    }
  }
}
</script>
