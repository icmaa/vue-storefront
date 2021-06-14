<template>
  <div class="order-review">
    <div v-if="active">
      <additional-products class="t-mb-6" />
      <p class="t-mb-4 t-text-sm">
        {{ $t('Please check if your order data is correct.') }}
      </p>
      <base-checkbox
        name="newsletter"
        id="newsletter"
        v-model="newsletter"
        checkbox-class="t-self-start"
        class="t-mb-2"
        v-if="!isSubscribedToNewsletter"
      >
        {{ $t("I would like to receive the newsletter as well as a {value} voucher.", { value: newsletterVoucherValue }) }}
      </base-checkbox>
      <template v-if="hasAgreements">
        <base-checkbox
          name="terms"
          id="terms"
          v-model="terms"
          :validations="[{
            condition: $v.terms.$error && (!$v.terms.required || !$v.terms.notFalse),
            text: $t('Field is required')
          }]"
          checkbox-class="t-self-start"
        >
          <i18n path="I have read and agree with the {toc}, {privacy-policy} and {return-instructions}." tag="p">
            <template v-slot:toc>
              <a :href="localizedRoutePath('/service-conditions')" target="_blank" class="t-text-base-tone t-underline" v-text="$t('Terms and Conditions')" />
            </template>
            <template v-slot:privacy-policy>
              <a :href="localizedRoutePath('/service-privacy')" target="_blank" class="t-text-base-tone t-underline" v-text="$t('Privacy Policy')" />
            </template>
            <template v-slot:return-instructions>
              <a :href="localizedRoutePath('/service-conditions')" target="_blank" class="t-text-base-tone t-underline" v-text="$t('Return instructions')" />
            </template>
          </i18n>
        </base-checkbox>
      </template>
      <button-component
        class="t-w-full lg:t-w-auto t-mt-8"
        :class="{ 't-opacity-50': $v.$dirty && $v.$invalid }"
        type="primary"
        @click.native.stop="submit"
      >
        {{ $t(('Place order')) }}
      </button-component>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { notFalse } from 'icmaa-config/helpers/validators'
import { localizedRoutePath } from '@vue-storefront/core/lib/multistore'

import Review from 'icmaa-checkout/components/Review'
import AdditionalProducts from 'theme/components/core/blocks/Checkout/AdditionalProducts'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  mixins: [ Review ],
  components: {
    AdditionalProducts,
    BaseCheckbox,
    ButtonComponent
  },
  validations () {
    let agreements = {}
    if (this.hasAgreements) {
      agreements = {
        terms: {
          required,
          notFalse
        }
      }
    }

    return {
      ...agreements
    }
  },
  methods: {
    localizedRoutePath
  }
}
</script>
