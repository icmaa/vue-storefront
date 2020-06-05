<template>
  <div
    class="t-flex t-items-center t-h-12 t-px-4 t-text-base-tone t-text-sm t-border-base-lightest t-cursor-pointer t-webkit-tap-transparent"
    :class="[ {'t-flex t-text-base-light': !option.available}, {'t-bg-base-lightest t-text-black t-relative': isActive && isLoading}, {'t-text-base-light': !isActive && isLoading}, isLast ? 't-border-b-0' : 't-border-b', option.available ? 'available' : 'unavailable']"
    @click="selectVariant"
    :aria-label="$t('Select ' + optionLabel)"
    data-test-id="DefaultSelector"
  >
    <span class="t-flex-auto">
      {{ optionLabel }}
    </span>
    <material-icon icon="done" class="t-flex-fix t-ml-2 t-text-alt-1" v-if="ticked" />
    <template v-if="option.available">
      <span v-if="price" class="t-flex-fix t-text-base-light">{{ price | price }}</span>
    </template>
    <template v-else-if="productAlert">
      <span
        class="t-flex-fix t-text-xs t-leading-1-em t-text-right"
        :class="{ 't-text-alt-3': isStockAlertSubscrided }"
        v-html="$t(isStockAlertSubscrided ? 'Size requested' : 'Request size')"
        data-test-id="StockAlertSubscribe"
      />
      <material-icon :icon="isStockAlertSubscrided ? 'check' : 'mail_outline'" class="t-flex-fix t-ml-2" :class="{ 't-text-alt-3': isStockAlertSubscrided }" />
    </template>
    <loader-background v-if="isActive && isLoading" class="t-bottom-0" />
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
      if (!this.isLoading && !this.isStockAlertSubscrided) {
        this.$emit('change', this.option)
      }
    }
  }
}
</script>
