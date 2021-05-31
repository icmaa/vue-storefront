<template>
  <div class="t-text-sm">
    <p class="t-mb-4">
      {{ info.description }}:
    </p>
    <div
      v-for="(account, i) in info.accounts"
      :key="`account-${i}`"
      class="t-border t-border-base-lightest t-p-4 t-rounded"
    >
      <div class="t-flex t-flex-wrap">
        <div v-text="account.account_holder.label" class="t-w-full t-text-xxs t-text-base-light t-uppercase t-font-light" />
        <div v-text="account.account_holder.value" class="t-mb-1" />
      </div>
      <div class="t-flex t-flex-wrap">
        <div v-text="account.iban.label" class="t-w-full t-text-xxs t-text-base-light t-uppercase t-font-light" />
        <div v-text="account.iban.value" class="t-mb-1" />
      </div>
      <div class="t-flex t-flex-wrap">
        <div v-text="account.bank_name.label" class="t-w-full t-text-xxs t-text-base-light t-uppercase t-font-light" />
        <div v-text="account.bank_name.value" class="t-mb-1" />
      </div>
      <div class="t-flex t-flex-wrap">
        <div v-text="account.bic.label" class="t-w-full t-text-xxs t-text-base-light t-uppercase t-font-light" />
        <div v-text="account.bic.value" />
      </div>
    </div>
  </div>
</template>

<script>
import MethodInfoBoxMixin from 'icmaa-payment/mixins/methods/InfoMixin'

export default {
  name: 'BankPaymentInfo',
  mixins: [ MethodInfoBoxMixin ]
}
</script>
