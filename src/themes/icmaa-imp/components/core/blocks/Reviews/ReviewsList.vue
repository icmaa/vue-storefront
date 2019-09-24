<template>
  <div>
    <div v-if="!itemsPerPage || itemsPerPage.length === 0" class="t-bg-white t-rounded-sm t-p-4">
      {{ $t('No reviews have been posted yet. Please don\'t hesitate to share Your opinion and write the first review!') }}
    </div>
    <div v-for="(item, index) in itemsPerPage" :key="index" itemprop="review" itemscope itemtype="http://schema.org/Review" class="t-bg-white t-rounded-sm t-p-4 t-mb-4">
      <h4 itemprop="reviewAspect" :content="item.title" v-html="item.title" />
      <meta itemprop="itemReviewed" :content="productName | htmlDecode">
      <p>
        {{ item.nickname }}, {{ item.created_at | date }}
      </p>
      <p class="cl-gray lh25" itemprop="reviewBody" :content="item.detail">
        {{ item.detail }}
      </p>
    </div>
    <div class="row middle-xs center-xs mt50" v-if="pageCount > 1">
      <a href="#" class="mr10 no-underline" :class="{ inactive: currentPage === 1 }" @click.prevent="prevPage">
        <i class="material-icons">chevron_left</i>
      </a>
      <span class="mx10 pagination-page" v-for="pageNumber in pageList" :key="pageNumber">
        <span class="fs-medium block py15 px20 bg-cl-mine-shaft cl-white" v-if="pageNumber === currentPage">
          {{ pageNumber }}
        </span>
        <a href="#" class="fs-medium block py15 px20 bg-cl-secondary pointer" v-else @click.prevent="changePage(pageNumber)">
          {{ pageNumber }}
        </a>
      </span>
      <a href="#" class="ml10 no-underline" :class="{ inactive: currentPage === pageCount }" @click.prevent="nextPage">
        <i class="material-icons">chevron_right</i>
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ReviewsStars from 'theme/components/core/blocks/Reviews/ReviewsStars'

export default {
  name: 'ReviewsList',
  components: {
    ReviewsStars
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
      items: 'review/getReviews',
      reviewsCount: 'review/getReviewsCount',
      reviewsTotalRating: 'review/getReviewsTotalRating'
    }),
    itemsPerPage () {
      let start = ((this.currentPage - 1) * this.perPage)
      let end = start + this.perPage
      return this.items.slice(start, end).filter(review => !!review.review_status)
    },
    pageCount () {
      return Math.floor(this.items.length / this.perPage) + Math.min(1, this.items.length % this.perPage)
    },
    pageList () {
      if (this.pageCount <= 5 || this.currentPage === 1 || this.currentPage === 2) {
        const pages = []
        for (let i = 1; i <= Math.min(this.pageCount, 5); i += 1) {
          pages.push(i)
        }
        return pages
      } else if (this.currentPage === this.pageCount || this.currentPage === this.pageCount - 1) {
        const pages = []
        for (let i = this.pageCount; i >= 1 && i >= this.pageCount - 4; i -= 1) {
          pages.unshift(i)
        }
        return pages
      } else {
        return [this.currentPage - 2, this.currentPage - 1, this.currentPage, this.currentPage + 1, this.currentPage + 2]
      }
    }
  },
  methods: {
    prevPage () {
      this.currentPage = Math.max(1, this.currentPage - 1)
    },
    nextPage () {
      this.currentPage = Math.min(this.pageCount, this.currentPage + 1)
    },
    changePage (pageNumber) {
      this.currentPage = Math.max(1, Math.min(this.pageCount, pageNumber))
    }
  }
}
</script>
