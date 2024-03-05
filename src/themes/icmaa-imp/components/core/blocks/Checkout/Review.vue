<template>
  <div class="order-review">
    <div v-if="active">
      <Cart
        v-if="isMobile"
        class="t-mb-6"
      >
        <template #headline>
          <h3
            class="t-mb-2 t-w-full t-font-light"
            v-text="$t('Shopping cart')"
          />
        </template>
      </Cart>
      <AdditionalProducts class="t-mb-6" />
      <p class="t-mb-4 t-text-sm">
        {{ $t('Please check if your order data is correct.') }}
      </p>
      <BaseCheckbox
        v-if="!isSubscribedToNewsletter"
        id="newsletter"
        v-model="newsletter"
        name="newsletter"
        checkbox-class="t-self-start"
        class="t-mb-2"
      >
        {{ $t("I would like to receive the newsletter as well as a {value} voucher.", { value: newsletterVoucherValue }) }}
      </BaseCheckbox>
      <template v-if="hasAgreements">
        <BaseCheckbox
          id="terms"
          v-model="terms"
          name="terms"
          :validations="[{
            condition: $v.terms.$error && (!$v.terms.required || !$v.terms.notFalse),
            text: $t('Field is required')
          }]"
          checkbox-class="t-self-start"
        >
          <i18n
            path="I have read and agree with the {toc}, {privacy-policy} and {return-instructions}."
            tag="p"
          >
            <template #toc>
              <a
                :href="localizedRoutePath('/service-conditions')"
                target="_blank"
                class="t-text-base-tone t-underline"
                v-text="$t('Terms and Conditions')"
              />
            </template>
            <template #privacy-policy>
              <a
                :href="localizedRoutePath('/service-privacy')"
                target="_blank"
                class="t-text-base-tone t-underline"
                v-text="$t('Privacy Policy')"
              />
            </template>
            <template #return-instructions>
              <a
                :href="localizedRoutePath('/service-conditions')"
                target="_blank"
                class="t-text-base-tone t-underline"
                v-text="$t('Return instructions')"
              />
            </template>
          </i18n>
        </BaseCheckbox>
      </template>
      <component
        :is="orderButtonComponent"
        v-if="orderButtonComponent"
      />
      <ButtonComponent
        v-else
        class="t-mt-8 t-w-full lg:t-w-auto"
        :class="{ 't-opacity-50': $v.$dirty && $v.$invalid }"
        type="primary"
        data-test-id="PlaceOrderButton"
        @click.native.stop="submit"
      >
        {{ $t(('Place order')) }}
      </ButtonComponent>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { notFalse } from 'icmaa-config/helpers/validators'
import { localizedRoutePath } from '@vue-storefront/core/lib/multistore'

import Review from 'icmaa-checkout/components/Review'
import AdditionalProducts from 'theme/components/core/blocks/Checkout/AdditionalProducts'
import Cart from 'theme/components/core/blocks/Checkout/Cart'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  components: {
    AdditionalProducts,
    BaseCheckbox,
    ButtonComponent,
    Cart
  },
  mixins: [ Review ],
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
