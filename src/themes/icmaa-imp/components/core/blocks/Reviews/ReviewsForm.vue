<template>
  <div
    id="reviews-form"
    class="reviews-form"
  >
    <form
      name="review"
      action="#"
      @submit.prevent="outOfScope()"
    >
      <div class="t-mb-4">
        <base-input
          id="name"
          v-model="reviewForm.name"
          name="name"
          :label="$t('First name')"
          :placeholder="sampleName"
          :validations="[
            {
              condition: $v.reviewForm.name.$error && !$v.reviewForm.name.required,
              text: $t('Field is required')
            },
            {
              condition: !$v.reviewForm.name.minLength,
              text: $t('Name must have at least 2 letters.')
            }
          ]"
        />
      </div>
      <div class="t-mb-4">
        <base-input
          id="email"
          v-model="reviewForm.email"
          name="email"
          type="email"
          :label="$t('Email address')"
          :placeholder="sampleEmail"
          :validations="[
            {
              condition: $v.reviewForm.email.$error && !$v.reviewForm.email.required,
              text: $t('Field is required')
            },
            {
              condition: !$v.reviewForm.email.email && $v.reviewForm.email.$error,
              text: $t('Please provide valid e-mail address.')
            }
          ]"
        />
      </div>
      <div class="t-mb-4">
        <base-select
          id="rating"
          v-model="reviewForm.rating"
          name="rating"
          :options="ratingOptions"
          :label="$t('Rating')"
          :initial-option-text="$t('How did you like it?')"
          :validations="[
            {
              condition: $v.reviewForm.rating.$error && !$v.reviewForm.rating.required,
              text: $t('Field is required')
            }
          ]"
        />
      </div>
      <div class="t-mb-4">
        <base-input
          id="summary"
          v-model="reviewForm.summary"
          name="summary"
          :label="$t('Summary')"
          :placeholder="$t('...')"
          :validations="[
            {
              condition: $v.reviewForm.summary.$error && !$v.reviewForm.summary.required,
              text: $t('Field is required')
            }
          ]"
        />
      </div>
      <div class="t-mb-4">
        <base-textarea
          id="review"
          v-model="reviewForm.review"
          name="review"
          :label="$t('Review')"
          placeholder="..."
          :validations="[
            {
              condition: $v.reviewForm.review.$error && !$v.reviewForm.review.required,
              text: $t('Field is required')
            }
          ]"
        />
      </div>
      <div>
        <div
          v-if="$v.reviewForm.recaptcha.$error && !this.$v.reviewForm.recaptcha.required"
          class="t-mb-2 t-text-sm t-text-alert"
        >
          {{ $t('Your Google reCAPTCHA validation is invalid.') }}<br>
          {{ $t('Please try again or contact our customer-support.') }}
        </div>
        <vue-recaptcha
          :sitekey="recaptchaWebsiteKey"
          :load-recaptcha-script="true"
          badge="inline"
          @verify="recaptchaVerify"
        >
          <button-component
            class="t-mt-4"
            :class="{ 'w-auto': !currentUser }"
            @click="validate()"
          >
            {{ $t('Add review') }}
          </button-component>
        </vue-recaptcha>
      </div>
    </form>
  </div>
</template>

<script>
import config from 'config'
import i18n from '@vue-storefront/i18n'
import { mapGetters } from 'vuex'
import { required, email, minLength } from 'vuelidate/lib/validators'

import VueRecaptcha from 'vue-recaptcha'
import ButtonComponent from 'theme/components/core/blocks/Button'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import BaseTextarea from 'theme/components/core/blocks/Form/BaseTextarea'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'

export default {
  name: 'ReviewsForm',
  components: {
    VueRecaptcha,
    ButtonComponent,
    BaseInput,
    BaseTextarea,
    BaseSelect
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      reviewForm: {
        name: '',
        email: '',
        rating: '',
        summary: '',
        review: '',
        recaptcha: ''
      }
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
    currentUser () {
      return this.$store.state.user.current
    },
    ratingOptions () {
      const total = 5
      let values = []
      for (let value = 1; value <= total; value++) {
        values.push({ value, label: i18n.t(`Reviewrating: ${value}`) })
      }

      return values.reverse()
    },
    sampleName () {
      const names = ['Jose', 'Ulli', 'Manu', 'Maria', 'Micha', 'Sigi', 'Sascha']
      return names[Math.floor(Math.random() * names.length)]
    },
    sampleEmail () {
      return this.sampleName.toLowerCase() + '@muster.de'
    },
    recaptchaWebsiteKey () {
      return config.icmaa.googleRecaptcha.websiteKey || false
    }
  },
  mounted () {
    this.$bus.$on('clear-add-review-form', this.clearReviewForm)
    this.$bus.$on('user-after-loggedin', this.fillInUserData)
  },
  destroyed () {
    this.$bus.$off('clear-add-review-form', this.clearReviewForm)
    this.$bus.$off('user-after-loggedin', this.fillInUserData)
  },
  beforeMount () {
    this.fillInUserData()
  },
  methods: {
    recaptchaVerify (token) {
      this.reviewForm.recaptcha = token
      this.validate()
    },
    recaptchaReset () {
      this.reviewForm.recaptcha = ''
      window.grecaptcha.reset()
    },
    validate () {
      if (!this.$v.reviewForm.recaptcha.$error && !this.$v.reviewForm.recaptcha.required) {
        return
      }

      this.$v.reviewForm.$touch()
      if (!this.$v.reviewForm.$invalid) {
        this.submit()
      }
    },
    async submit () {
      this.$store.dispatch('ui/loader', { active: true })

      const isReviewCreated = await this.$store.dispatch('review/add', {
        'review_entity': 'product',
        'product_id': this.productId,
        'customer_id': this.currentUser ? this.currentUser.id : null,
        'name': this.reviewForm.name,
        'email': this.reviewForm.summary,
        'rating': this.reviewForm.rating,
        'title': this.reviewForm.summary,
        'detail': this.reviewForm.review,
        'recaptcha': this.reviewForm.recaptcha
      })

      this.$store.dispatch('ui/loader', false)

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
      this.reviewForm.name = ''
      this.reviewForm.email = ''
      this.reviewForm.rating = ''
      this.reviewForm.summary = ''
      this.reviewForm.review = ''
      this.$v.$reset()

      this.recaptchaReset()
    },
    fillInUserData () {
      if (this.currentUser) {
        this.reviewForm.name = this.currentUser.firstname
        this.reviewForm.email = this.currentUser.email
      }
    }
  },
  validations: {
    reviewForm: {
      name: {
        minLength: minLength(2),
        required
      },
      email: {
        required,
        email
      },
      rating: {
        required
      },
      summary: {
        required
      },
      review: {
        required
      },
      recaptcha: {
        required
      }
    }
  }
}
</script>
