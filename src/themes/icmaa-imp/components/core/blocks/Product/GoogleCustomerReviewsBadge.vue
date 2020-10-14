<template>
  <div @click="$emit('click')">
    <div class="t-flex t-items-center" style="color: #e57125">
      <span class="t-text-sm t-mr-1">{{ score }}</span>
      <material-icon icon="star" size="xs" />
      <material-icon icon="star" size="xs" />
      <material-icon icon="star" size="xs" />
      <material-icon icon="star" size="xs" />
      <material-icon icon="star" size="xs" />
    </div>
    <img :width="40" :height="13" src="~/theme/assets/logos/google-logo-gray.svg" alt="Google Reviews">
    <div class="t-text-xs t-text-base-light">
      {{ $t('Customer reviews') }}
    </div>
  </div>
</template>

<script>

import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'GoogleCustomerReviewsBadge',
  components: {
    MaterialIcon
  },
  props: {
    score: {
      type: String,
      default: '4,8'
    }
  }
}
</script>
