<template>
  <div class="placeholder">
    <div
      v-if="showLarge"
      class="xs:t-px-0 sm:t-px-4"
      :class="{ 't-mb-8': showSplit }"
    >
      <placeholder :ratio="isMobile ? '1:1' : '2:1'" />
    </div>
    <div
      v-if="showSplit"
      class="t-flex t-flex-wrap"
    >
      <div
        v-for="(n, i) in 4"
        :key="'placeholder-' + i"
        class="t-px-4"
        :class="{ 't-w-1/2 lg:t-w-1/4 t-mb-8': showSmallInRow, 't-w-full': !showSmallInRow, 't-mb-8': !showSmallInRow && i !== 3 }"
      >
        <placeholder
          v-if="showSmallInRow"
          :ratio="'96:107'"
        />
        <placeholder
          v-else
          :ratio="isMobile ? '215:334' : '2:1'"
        />
      </div>
    </div>
  </div>
</template>

<script>

import Placeholder from 'theme/components/core/blocks/Placeholder'

export default {
  name: 'TeaserSkeleton',
  components: {
    Placeholder
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    },
    showLarge: {
      type: Boolean,
      default: true
    },
    showSplit: {
      type: Boolean,
      default: true
    },
    showSmallInRow: {
      type: Boolean,
      default: false
    }
  }
}
</script>
