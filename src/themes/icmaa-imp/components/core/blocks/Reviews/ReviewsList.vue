<template>
  <div class="reviews-list">
    <div
      v-if="!itemsPerPage || itemsPerPage.length === 0"
      class="t-rounded-sm t-bg-white t-p-4 t-text-sm t-text-base-light"
    >
      {{ $t('No reviews have been posted yet. Please don\'t hesitate to share Your opinion and write the first review!') }}
    </div>
    <div
      v-for="(item, index) in itemsPerPage"
      :key="index"
      class="t-rounded-sm t-bg-white t-p-4"
      :class="{ 't-mb-4': (index + 1) < perPage && (index + 1) < items.length }"
    >
      <meta
        :content="item.title"
        v-html="item.title"
      >
      <meta :content="productName | htmlDecode">
      <meta :content="item.detail | htmlDecode">
      <ReviewsStars
        :rating="item.ratings_total"
        stars-size="sm"
        class="t-text-md t-mt-2 t-flex t-items-center t-text-base-light"
      />
      <p
        class="t-my-4 t-text-sm"
        v-html="item.detail"
      />
      <p
        class="t-text-sm t-text-base-light"
        v-text="item.nickname + ' / ' + item.date"
      />
    </div>
    <div
      v-if="pageCount > 1"
      class="t-mt-8 t-flex t-justify-center"
    >
      <ButtonComponent
        type="ghost"
        icon="chevron_left"
        :icon-only="true"
        size="sm"
        class="t-mx-2"
        :class="{ 't-opacity-25': currentPage === 1, 't-bg-white': currentPage !== 1 }"
        @click.native="prevPage"
      />
      <ButtonComponent
        type="ghost"
        icon="chevron_right"
        :icon-only="true"
        size="sm"
        class="t-mx-2"
        :class="{ 't-opacity-25': currentPage === pageCount, 't-bg-white': currentPage !== pageCount }"
        @click.native="nextPage"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { toDate } from 'icmaa-config/helpers/datetime'
import ReviewsStars from 'theme/components/core/blocks/Reviews/ReviewsStars'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'ReviewsList',
  components: {
    ReviewsStars,
    ButtonComponent
  },
  props: {
    perPage: {
      type: Number,
      required: false,
      default: 4
    },
    productName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      currentPage: 1
    }
  },
  computed: {
    ...mapGetters({
      reviews: 'review/getReviews',
      reviewsCount: 'review/getReviewsCount',
      reviewsTotalRating: 'review/getReviewsTotalRating',
      reviewAvgRating: 'review/getReviewAvgRating'
    }),
    items () {
      return this.reviews.map(rvw => {
        rvw['ratings_total'] = this.reviewAvgRating(rvw)
        rvw.date = toDate(rvw.created_at, undefined, 'YYYY-MM-DD HH:mm:ss')
        return rvw
      })
    },
    itemsPerPage () {
      let start = ((this.currentPage - 1) * this.perPage)
      let end = start + this.perPage
      return this.items.slice(start, end).filter(review => !!review.review_status)
    },
    pageCount () {
      return Math.floor(this.items.length / this.perPage) + Math.min(1, this.items.length % this.perPage)
    }
  },
  methods: {
    prevPage () {
      this.currentPage = Math.max(1, this.currentPage - 1)
    },
    nextPage () {
      this.currentPage = Math.min(this.pageCount, this.currentPage + 1)
    }
  }
}
</script>
