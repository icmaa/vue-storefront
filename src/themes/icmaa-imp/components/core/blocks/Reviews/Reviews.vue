<template>
  <section>
    <div data-test-id="Reviews">
      <h2 class="t-mb-4 t-text-lg t-font-bold t-text-base-dark">
        {{ $t('Reviews') }}
      </h2>
      <div class="t-mb-4 t-flex t-items-center t-justify-between">
        <div class="t-flex t-items-center t-text-sm">
          <ReviewsStars
            :rating="reviewsTotalRating"
            stars-size="sm"
            stars-color="t-text-base-dark"
            class="t-text-base-dark"
          />
          <span class="t-ml-2 t-hidden sm:t-block">({{ total }})</span>
        </div>
        <ButtonComponent
          v-model="formVisible"
          size="sm"
          @click.native="toggleForm"
        >
          {{ $t('Add review') }}
        </ButtonComponent>
      </div>
    </div>
    <ReviewsForm
      v-if="formVisible"
      :product="product"
      class="t-mb-8 t-bg-white t-p-4"
    />
    <ReviewsList
      :product-name="productName"
      :per-page="4"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'
import VueScrollTo from 'vue-scrollto'

import ReviewsStars from 'theme/components/core/blocks/Reviews/ReviewsStars'
import ReviewsList from 'theme/components/core/blocks/Reviews/ReviewsList'
import ReviewsForm from 'theme/components/core/blocks/Reviews/ReviewsForm'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'Reviews',
  components: {
    ReviewsList,
    ReviewsForm,
    ReviewsStars,
    ButtonComponent
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    productName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      formVisible: false
    }
  },
  computed: {
    ...mapGetters({
      reviews: 'review/getReviews',
      reviewsCount: 'review/getReviewsCount',
      reviewsTotalRating: 'review/getReviewsTotalRating'
    }),
    productId () {
      return this.product.parentId || this.product.id
    },
    total () {
      return this.reviewsCount + ' ' + (this.reviewsCount > 1 ? i18n.t('Reviews') : i18n.t('Review'))
    },
    currentUser () {
      return this.$store.state.user.current
    }
  },
  mounted () {
    this.$bus.$on('product-after-load', this.refreshList)
    this.$bus.$on('reviews-open-form', this.goToForm)
  },
  destroyed () {
    this.$bus.$off('product-after-load', this.refreshList)
    this.$bus.$off('reviews-open-form', this.goToForm)
  },
  beforeMount () {
    this.refreshList()
  },
  methods: {
    goToForm () {
      this.formVisible = 1
      VueScrollTo.scrollTo('#reviews', { offset: -110 })
    },
    toggleForm () {
      this.formVisible = !this.formVisible
    },
    refreshList () {
      this.$store.dispatch('review/list', { productId: this.productId })
    }
  }
}
</script>
