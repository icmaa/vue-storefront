<template>
  <span>
    <material-icon v-for="(star,i) in stars" :key="i" :icon="star" size="xs" class="t-align-text-bottom" :class="{'t-text-alt-2': star !== 'star_border'}" />
  </span>
</template>

<script>
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'ReviewsStars',
  components: {
    MaterialIcon
  },
  props: {
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
    ratingCalculated () {
      return this.rating / 100 * this.maxRating
    },
    stars () {
      let stars = []
      const fullStars = parseInt(this.ratingCalculated)
      const partialStar = Math.round(this.ratingCalculated - fullStars)
      const emptyStars = this.maxRating - fullStars - partialStar

      for (let i = 1; i <= this.maxRating; i++) {
        if (i <= fullStars) {
          stars.push('star')
        } else if (i > fullStars && i <= this.maxRating - emptyStars && partialStar > 0) {
          stars.push('star_half')
        } else if (i > this.ratingCalculated) {
          stars.push('star_border')
        }
      }

      return stars
    }
  }
}
</script>
