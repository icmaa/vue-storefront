<template>
  <div class="reviews t-text-base-light t-text-sm">
    <reviews-stars :rating="rating" :max-rating="maxRating" />
    <span>({{ total }})</span>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import ReviewsStars from 'theme/components/core/blocks/Reviews/ReviewsStars'

export default {
  name: 'ReviewsShort',
  components: {
    ReviewsStars
  },
  props: {
    count: {
      type: Number,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    maxRating: {
      type: Number,
      default: 5
    }
  },
  computed: {
    total () {
      return this.count + ' ' + (this.count > 1 ? i18n.t('Reviews') : i18n.t('Review'))
    }
  }
}
</script>
