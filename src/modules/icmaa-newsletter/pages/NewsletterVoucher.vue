<template>
  <div class="t-container">
    <div class="t-bg-white t-p-4 lg:t-p-8 lg:t-w-1/2 t-m-4 lg:t-mt-8 lg:t-mx-auto" :class="{ 'lg:t-mb-8': hasError }">
      <template v-if="!hasError">
        <h1 class="t-text-1xl t-text-primary t-mb-2 lg:t-mb-4">
          {{ $t('Your personal coupon code') }} *
        </h1>
        <p class="t-mb-4 lg:t-mb-8">
          {{ $t('Congratulations, your personal code has now successfully been created. You can use it in your cart or in the last step of the checkout.') }}
        </p>
        <div v-text="voucher.code" class="t-font-mono t-text-xl t-text-base-dark t-p-4 t-bg-base-lightest t-mb-4" />
        <div class="t-flex t-flex-wrap t--mx-2">
          <div class="t-w-full lg:t-w-1/2 t-mb-2 lg:t-mb-0 t-px-2">
            <button-component type="primary" class="t-w-full" @click="$router.push(localizedRoute(`/checkout`))">
              {{ $t('Go to checkout') }}
            </button-component>
          </div>
          <div class="t-w-full lg:t-w-1/2 t-px-2">
            <button-component type="transparent" class="t-w-full" @click="$store.dispatch('ui/setMicrocart')">
              {{ $t('Edit your cart') }}
            </button-component>
          </div>
        </div>
      </template>
      <template v-else>
        <h1 class="t-text-1xl t-text-primary t-mb-2 lg:t-mb-4">
          {{ $t('An error occurred') }}
        </h1>
        <div class="t-leading-5">
          <template v-if="voucher.msg">
            {{ voucher.msg }}
          </template>
          <template v-else>
            {{ $t('Sorry, we can\'t find a coupon code for you.') }}
          </template>
          {{ $t('Please try to click the link we send you again.') }}
        </div>
      </template>
    </div>
    <div class="t-mx-4 lg:t-w-1/2 t-my-4 lg:t-mb-8 lg:t-mx-auto t-text-base-light t-text-sm" v-if="voucher && voucher.code">
      <material-icon icon="asterisk" icon-set="icmaa" size="xxs" />
      {{ disclaimer }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import ButtonComponent from 'theme/components/core/blocks/Button'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'NewsletterVoucher',
  components: {
    ButtonComponent,
    MaterialIcon
  },
  props: {
    isBirthday: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      voucher: 'newsletter/getVoucher',
      getBlockByIdentifier: 'icmaaCmsBlock/getBlockByIdentifier'
    }),
    email () {
      return this.$route.query.email
    },
    rule () {
      return this.$route.query.rule
    },
    hasError () {
      return !this.voucher || !this.voucher.code || this.voucher.error
    },
    disclaimerBlock () {
      return this.getBlockByIdentifier('voucher-mailing-disclaimer')
    },
    disclaimer () {
      return this.disclaimerBlock ? this.disclaimerBlock.content : ''
    }
  },
  methods: {
    async fetchData () {
      const [email, rule, birthday] = [this.email, this.rule, this.isBirthday]

      return Promise.all([
        this.$store.dispatch('newsletter/getVoucher', { email, rule, birthday }),
        this.$store.dispatch('icmaaCmsBlock/single', { value: 'voucher-mailing-disclaimer' })
      ])
    }
  },
  serverPrefetch () {
    return this.fetchData()
  },
  async mounted () {
    if (!this.voucher) {
      return this.fetchData()
    }
  }
}
</script>
