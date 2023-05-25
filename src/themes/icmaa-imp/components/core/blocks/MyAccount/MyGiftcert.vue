<template>
  <div class="t-bg-white t-p-4">
    <Headline>
      {{ $t('My coupons') }}
    </Headline>

    <div
      v-if="number && number.length > 0"
      class="t-mb-6 t-flex t-w-full t-flex-wrap t-rounded-sm t-bg-base-lightest t-p-4 t-pb-2 lg:t-w-1/2"
    >
      <template v-if="number && number.length > 0">
        <div class="t-mb-2 t-w-full t-px-2 t-text-sm t-font-bold lg:t-w-1/3">
          {{ $t('Card number') }}
        </div>
        <div class="t-mb-2 t-w-full t-px-2 t-font-mono lg:t-w-2/3">
          {{ number }}
        </div>
      </template>
      <template v-if="balance && currency && balance >= 0">
        <div class="t-mb-2 t-w-full t-px-2 t-text-sm t-font-bold lg:t-w-1/3">
          {{ $t('Balance') }}
        </div>
        <div class="t-mb-2 t-w-full t-px-2 t-font-mono lg:t-w-2/3">
          {{ balance }} {{ currency }}
        </div>
      </template>
      <template v-if="expires && expires !== null && expires.length > 0">
        <div class="t-mb-2 t-w-full t-px-2 t-text-sm t-font-bold lg:t-w-1/3">
          {{ $t('Expires at') }}
        </div>
        <div class="t-mb-2 t-w-full t-px-2 t-font-mono lg:t-w-2/3">
          {{ expires }}
        </div>
      </template>
    </div>

    <div class="t--mx-2 t-flex t-w-full t-flex-wrap">
      <div class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2">
        <BaseInput
          v-model="giftCert.number"
          type="text"
          name="code"
          :label="$t('Card number') + ' *'"
          :validations="[
            {
              condition: $v.giftCert.number.$error && !$v.giftCert.number.required,
              text: $t('Field is required')
            }
          ]"
          @blur="$v.giftCert.number.$touch()"
        />
      </div>

      <div class="t-mb-4 t-w-full t-px-2">
        <ButtonComponent
          type="primary"
          class="t-flex-1 lg:t-flex-fix"
          @click="fetchGiftcert"
        >
          {{ $t('Check balance') }}
        </ButtonComponent>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Headline from 'theme/components/core/blocks/MyAccount/Headline'
import i18n from '@vue-storefront/i18n'
import { required } from 'vuelidate/lib/validators'
import ButtonComponent from 'theme/components/core/blocks/Button'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'

export default {
  name: 'MyGiftcert',
  components: {
    ButtonComponent,
    BaseInput,
    Headline
  },
  data () {
    return {
      giftCert: {
        number: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      number: 'icmaaGiftcert/getGiftcertNumber',
      balance: 'icmaaGiftcert/getGiftcertBalance',
      currency: 'icmaaGiftcert/getGiftcertCurrency',
      expires: 'icmaaGiftcert/getGiftcertExpires'
    })
  },
  validations: {
    giftCert: {
      number: {
        required
      }
    }
  },
  methods: {
    async fetchGiftcert () {
      await this.$store.dispatch('icmaaGiftcert/fetchGiftcert', { number: this.giftCert.number })
    }
  }
}
</script>
