<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="reviews-claim t-bg-alt-1 t-p-8 t-text-xs t-text-white"
      :class="[ reviewsCount > 0 ? 't-absolute t-bottom-0 t-left-0 t-w-full' : 't--mx-8 t--mb-8 t-mt-8' ]"
      data-test-id="ReviewsClaim"
    >
      <h4 class="t-mb-2 t-text-lg">
        {{ $t('Write a review and get a {voucher} voucher!', { voucher }) }}
      </h4>
      <p class="t-mb-4">
        {{ $t('Leave us a 50 words review and win one of three {voucher} vouchers each month.', { voucher }) }}
      </p>
      <div class="t-flex">
        <ButtonComponent
          type="ghost-white"
          data-test-id="ReviewsClaimAccept"
          @click.native="accept"
        >
          {{ $t('Add review') }}
        </ButtonComponent>
        <ButtonComponent
          type="transparent-white"
          icon="close"
          :icon-only="true"
          @click.native="close"
        >
          {{ $t('Close') }}
        </ButtonComponent>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

import i18n from '@vue-storefront/i18n'
import { price } from '@vue-storefront/core/filters/price'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  components: {
    ButtonComponent
  },
  data () {
    return {
      isOpen: false
    }
  },
  computed: {
    ...mapGetters({
      reviewsCount: 'review/getReviewsCount',
      storeConfig: 'icmaaConfig/getCurrentStoreConfig'
    }),
    voucher () {
      const config = this.storeConfig
      if (config.reviews && config.reviews.voucher_value) {
        return config.reviews.voucher_value
      }

      return price(50)
    }
  },
  created () {
    this.$store.dispatch('claims/check', { claimCode: 'reviewsClaimAccepted' })
      .then(claim => {
        if (!claim) {
          this.isOpen = true
          this.$store.dispatch('claims/set', { claimCode: 'reviewsClaimAccepted', value: false })
        } else {
          this.isOpen = !claim.value
        }
      })
  },
  methods: {
    accept () {
      this.$bus.$emit('reviews-open-form')
      this.close()
    },
    close () {
      this.$store.dispatch('claims/set', { claimCode: 'reviewsClaimAccepted', value: true })
      this.isOpen = false
    }
  }
}
</script>
