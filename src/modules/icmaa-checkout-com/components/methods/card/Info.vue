<template>
  <div class="t-pt-2">
    <div
      class="t-text-sm"
      v-text="info.description"
      v-if="info.description"
    />
    <form @submit.prevent="submit" class="t-mt-2">
      <div class="input-container card-number">
        <div class="icon-container">
          <img
            id="icon-card-number"
            src="~/icmaa-checkout-com/assets/card-icons/card.svg"
            alt="PAN"
          >
        </div>
        <div class="card-number-frame" />
        <div class="icon-container payment-method" :class="{ show: !!paymentMethod }">
          <img id="logo-payment-method" :src="paymentMethodIcon">
        </div>
      </div>

      <div class="input-container expiry-date">
        <div class="icon-container">
          <img
            id="icon-expiry-date"
            src="~/icmaa-checkout-com/assets/card-icons/exp-date.svg"
            alt="Expiry date"
          >
        </div>
        <div class="expiry-date-frame" />
      </div>

      <div class="input-container cvv">
        <div class="icon-container">
          <img
            id="icon-cvv"
            src="~/icmaa-checkout-com/assets/card-icons/cvv.svg"
            alt="CVV"
          >
        </div>
        <div class="cvv-frame" />
      </div>
      <validation-messages :validations="[
        {
          condition: isDirty && !isValid,
          text: $t('Please validate your card information')
        }
      ]"
      />
    </form>
  </div>
</template>

<script>

import MethodInfoBoxMixin from 'icmaa-payment/mixins/methods/InfoMixin'
import CardPaymentMethod from 'icmaa-checkout-com/mixins/methods/CardPaymentMethod'
import ValidationMessages from 'theme/components/core/blocks/Form/ValidationMessages.vue'

export default {
  components: {
    ValidationMessages
  },
  mixins: [
    MethodInfoBoxMixin,
    CardPaymentMethod
  ]
}
</script>

<style lang="scss" scoped>

.card-number-frame,
.expiry-date-frame,
.cvv-frame {
  flex: 1 1 auto;
  padding-left: 40px;
}

.input-container {
  position: relative;
  display: flex;
  height: 40px;

  &.card-number {
    margin-bottom: 8px;
  }

  &.expiry-date {
    margin-right: 8px;
  }
}

.icon-container {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  width: 26px;
  margin: 0 7px;

  &:last-child {
    right: 0;
  }

  &.payment-method {
    transform: translateY(-50%) rotateY(90deg);
    transition: opacity 0.15s ease-out;
    opacity: 0;
    top: 50%;
    right: 0;
  }

  &.payment-method.show {
    opacity: 1;
    transition: all 0.4s ease-out;
    transform: translateY(-50%) rotateY(0deg);
  }

  &.payment-method img {
    width: 100%;
  }
}

[id$="-error"] {
  display: none;
}
</style>
