<template>
  <div
    class="t-flex t-cursor-pointer t-items-center t-border-base-lightest t-px-4 t-text-sm t-webkit-tap-transparent"
    :class="[
      optionLabel.length > 45 ? 't-py-2' : 't-h-12',
      {
        't-flex t-text-base-light': !option.available,
        't-relative t-bg-base-lightest t-text-black': isActive && isLoading,
      },
      (!isActive && isLoading) || !option.available ? 't-text-base-light' : 't-text-base-tone',
      isLast ? 't-border-b-0' : 't-border-b',
      option.available ? 'available' : 'unavailable'
    ]"
    :aria-label="$t('Select') + ' ' + optionLabel"
    data-test-id="DefaultSelector"
    @click="selectVariant"
  >
    <span class="t-flex-auto">
      {{ optionLabel }}
    </span>
    <template v-if="option.available">
      <MaterialIcon
        v-if="ticked"
        icon="done"
        class="t-ml-2 t-flex-fix t-text-alt-1"
        :class="{ 't-mr-2': price }"
      />
      <span
        v-if="price"
        class="t-flex-fix t-text-base-light"
      >{{ price | price }}</span>
    </template>
    <template v-else-if="productAlert">
      <span
        class="t-flex-fix t-text-right t-text-xs t-leading-1-em"
        :class="{ 't-text-alt-3': isStockAlertSubscrided }"
        data-test-id="StockAlertSubscribe"
        v-html="$t(isStockAlertSubscrided ? 'Size requested' : 'Request size')"
      />
      <MaterialIcon
        :icon="isStockAlertSubscrided ? 'check' : 'mail_outline'"
        class="t-ml-2 t-flex-fix"
        :class="{ 't-text-alt-3': isStockAlertSubscrided }"
      />
    </template>
    <LoaderBackground
      v-if="isActive && isLoading"
      class="t-bottom-0"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import LoaderBackground from 'theme/components/core/LoaderBackground'

export default {
  name: 'DefaultSelector',
  components: {
    MaterialIcon,
    LoaderBackground
  },
  props: {
    option: {
      type: Object,
      default: () => ({})
    },
    label: {
      type: [String, Boolean],
      default: false
    },
    price: {
      type: [Number, Boolean],
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    productAlert: {
      type: Boolean,
      default: true
    },
    ticked: {
      type: Boolean,
      default: false
    },
    isLast: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters('attribute', ['getOptionLabel']),
    ...mapGetters('icmaaProductAlert', ['isOptionSubscribedToStock']),
    isStockAlertSubscrided () {
      return this.productAlert && this.isOptionSubscribedToStock(this.option)
    },
    optionLabel () {
      return this.label ? this.label : this.getOptionLabel({ attributeKey: this.option.type, optionId: this.option.id })
    }
  },
  methods: {
    selectVariant () {
      if (!this.isDisabled && !this.isLoading && !this.isStockAlertSubscrided) {
        this.$emit('change', this.option)
      }
    }
  }
}
</script>
