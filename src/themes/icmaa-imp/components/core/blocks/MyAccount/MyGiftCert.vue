<template>
  <div class="t-p-4 t-bg-white">
    <headline icon="mail">
      {{ $t('My coupons') }}
    </headline>

    <div class="t-w-full t-flex t-flex-wrap">
      <div class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4">
        <base-input
          class=""
          type="text"
          name="code"
          :label="$t('Card number') + ' *'"
          v-model="giftCert.number"
          @blur="$v.giftCert.number.$touch()"
          :validations="[
            {
              condition: $v.giftCert.number.$error && !$v.giftCert.number.required,
              text: $t('Field is required')
            }
          ]"
        />
      </div>

      <div class="t-px-2 t-w-full t-mb-4">
        <button-component type="primary" class="t-flex-1 lg:t-flex-fix" @click="fetchGiftCert">
          {{ $t('Check balance') }}
        </button-component>
      </div>
      <template v-if="getNumber.length > 0">
        <div class="t-flex t-w-full t-flex-wrap">
          <div class="t-w-full t-px-2 t-font-bold">
            {{ $t('Card number') }}
          </div>
          <div class="t-w-full t-px-2 t-mb-4">
            {{ getNumber }}
          </div>
        </div>
      </template>
      <template v-if="getBalance >= 0">
        <div class="t-flex t-w-full t-flex-wrap">
          <div class="t-w-full t-px-2 t-font-bold">
            {{ $t('Balance') }}
          </div>
          <div class="t-w-full t-px-2 t-mb-4">
            {{ getBalance }} {{ getCurrency }}
          </div>
        </div>
      </template>
      <template v-if="getExpires !== null && getExpires.length > 0">
        <div class="t-flex t-w-full t-flex-wrap">
          <div class="t-w-full t-px-2 t-font-bold">
            {{ $t('Expires at') }}
          </div>
          <div class="t-w-full t-px-2 t-mb-4">
            {{ getExpires }}
          </div>
        </div>
      </template>
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
  name: 'MyGiftCert',
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
      getNumber: 'icmaaGiftCert/getGiftCertNumber',
      getBalance: 'icmaaGiftCert/getGiftCertBalance',
      getCurrency: 'icmaaGiftCert/getGiftCertCurrency',
      getExpires: 'icmaaGiftCert/getGiftCertExpires'
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
    async fetchGiftCert () {
      await this.$store.dispatch('icmaaGiftCert/fetchGiftCert', { number: this.giftCert.number })
    }
  }
}
</script>
