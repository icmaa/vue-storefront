<template>
  <div>
    <div>
      <h2 class="t-text-lg t-text-base-dark t-font-bold t-mb-4">
        {{ $t('Reviews') }}
      </h2>
      <div class="t-flex t-items-center t-justify-between t-mb-4">
        <div class="t-flex t-items-center t-text-sm">
          <reviews-stars :rating="reviewsTotalRating" stars-size="sm" stars-color="t-text-base-dark" class="t-text-base-dark" />
          <span class="t-ml-2 t-hidden sm:t-block">({{ total }})</span>
        </div>
        <button-component size="sm" v-model="formVisible">
          {{ $t('Add review') }}
        </button-component>
      </div>
      <reviews-list :product-name="productName" :per-page="4" />
    </div>
    <section v-if="formVisible">
      <h2>{{ $t('Add review') }}</h2>
      <form action="#" @submit.prevent="outOfScope()">
        <div class="mb10 pt50">
          <base-input
            type="text"
            :placeholder="$t('First name') + ' *'"
            v-model="formData.name"
            @blur="$v.formData.name.$touch()"
            :validations="[
              {
                condition: $v.formData.name.$error && !$v.formData.name.required,
                text: $t('Field is required')
              },
              {
                condition: !$v.formData.name.minLength,
                text: $t('Name must have at least 2 letters.')
              }
            ]"
          />
        </div>
        <div class="mb10">
          <base-input
            type="email"
            :placeholder="$t('Email address') + ' *'"
            v-model="formData.email"
            @blur="$v.formData.email.$touch()"
            :validations="[
              {
                condition: $v.formData.email.$error && !$v.formData.email.required,
                text: $t('Field is required')
              },
              {
                condition: !$v.formData.email.email && $v.formData.email.$error,
                text: $t('Please provide valid e-mail address.')
              }
            ]"
          />
        </div>
        <div class="mb10">
          <base-input
            type="text"
            :placeholder="$t('Summary') + ' *'"
            v-model="formData.summary"
            @blur="$v.formData.summary.$touch()"
            :validations="[
              {
                condition: $v.formData.summary.$error && !$v.formData.summary.required,
                text: $t('Field is required')
              }
            ]"
          />
        </div>
        <div class="mb25">
          <base-textarea
            type="text"
            :placeholder="$t('Review') + ' *'"
            v-model="formData.review"
            @blur="$v.formData.review.$touch()"
            :validations="[
              {
                condition: $v.formData.review.$error && !$v.formData.review.required,
                text: $t('Field is required')
              }
            ]"
          />
        </div>
        <div class="row m0 middle-xs center-xs start-sm buttons">
          <button-component
            @click.native="validate()"
            :class="{ 'w-auto': !currentUser }"
          >
            {{ $t('Add review') }}
          </button-component>
          <no-ssr>
            <span
              class="fs-medium ml20 cl-gray lh30 py5 block"
              v-if="!currentUser"
            >
              {{ $t('or') }} <a href="#" class="cl-primary" @click.prevent="login()">{{ $t('login') }}</a> {{ $t('to account') }}
            </span>
          </no-ssr>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import { mapGetters } from 'vuex'
import { required, email, minLength } from 'vuelidate/lib/validators'

import ReviewsStars from 'theme/components/core/blocks/Reviews/ReviewsStars'
import ReviewsList from 'theme/components/core/blocks/Reviews/ReviewsList'
import ButtonComponent from 'theme/components/core/blocks/Button'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import BaseTextarea from 'theme/components/core/blocks/Form/BaseTextarea'
import { AddReview } from '@vue-storefront/core/modules/review/components/AddReview'
import NoSSR from 'vue-no-ssr'

export default {
  name: 'Reviews',
  data () {
    return {
      formVisible: false,
      formData: {
        name: '',
        email: '',
        summary: '',
        review: ''
      }
    }
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
  components: {
    ReviewsStars,
    ButtonComponent,
    BaseInput,
    BaseTextarea,
    ReviewsList,
    'no-ssr': NoSSR
  },
  computed: {
    ...mapGetters({
      reviews: 'review/getReviews',
      reviewsCount: 'review/getReviewsCount',
      reviewsTotalRating: 'review/getReviewsTotalRating'
    }),
    productId () {
      return this.product.id
    },
    total () {
      return this.reviewsCount + ' ' + (this.reviewsCount > 1 ? i18n.t('Reviews') : i18n.t('Review'))
    },
    currentUser () {
      return this.$store.state.user.current
    }
  },
  methods: {
    validate () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submit()
      }
    },
    refreshList () {
      this.$store.dispatch('review/list', { productId: this.productId })
    },
    async submit () {
      const isReviewCreated = await this.$store.dispatch('review/add', {
        'product_id': this.productId,
        'title': this.formData.summary,
        'detail': this.formData.review,
        'nickname': this.formData.name,
        'review_entity': 'product',
        'customer_id': this.currentUser ? this.currentUser.id : null
      })

      if (isReviewCreated) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'success',
          message: i18n.t('You submitted your review for moderation.'),
          action1: { label: i18n.t('OK') }
        })
        return
      }
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: i18n.t('Something went wrong. Try again in a few seconds.'),
        action1: { label: i18n.t('OK') }
      })
    },
    clearReviewForm () {
      this.formData.name = ''
      this.formData.email = ''
      this.formData.summary = ''
      this.formData.review = ''
      this.$v.$reset()
    },
    login () {
      this.$bus.$emit('modal-show', 'modal-signup')
    },
    fillInUserData () {
      if (this.currentUser) {
        this.formData.name = this.currentUser.firstname
        this.formData.email = this.currentUser.email
      }
    }
  },
  mounted () {
    this.$bus.$on('product-after-load', this.refreshList)
    this.$bus.$on('clear-add-review-form', this.clearReviewForm)
    this.$bus.$on('user-after-loggedin', this.fillInUserData)
  },
  destroyed () {
    this.$bus.$off('product-after-load', this.refreshList)
    this.$bus.$off('clear-add-review-form', this.clearReviewForm)
    this.$bus.$off('user-after-loggedin', this.fillInUserData)
  },
  beforeMount () {
    this.refreshList()
    this.fillInUserData()
  },
  validations: {
    formData: {
      name: {
        minLength: minLength(2),
        required
      },
      email: {
        required,
        email
      },
      summary: {
        required
      },
      review: {
        required
      }
    }
  }
}
</script>
