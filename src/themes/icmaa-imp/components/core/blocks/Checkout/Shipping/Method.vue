<template>
  <div
    class="t-flex t-cursor-pointer t-items-start"
    :class="{ 't-opacity-50': !active }"
    @click="onClick"
  >
    <RetinaImage
      v-if="method.image"
      :image="method.image"
      :placeholder="true"
      ratio="70:32"
      class="t-mr-2"
      :class="{ 't-opacity-75 t-grayscale': !active }"
    />
    <div class="t-leading-4">
      <h3 class="t-font-bold">
        {{ method.title }}
      </h3>
      <p class="t-text-xs t-text-base-tone">
        {{ method.description }}<span>, {{ price(method.amount) }}</span>
      </p>
    </div>
  </div>
</template>

<script>

import { price } from 'icmaa-config/helpers/price'
import RetinaImage from 'theme/components/core/blocks/RetinaImage'

export default {
  name: 'ShippingMethod',
  components: {
    RetinaImage
  },
  props: {
    method: {
      type: Object,
      required: true
    },
    value: {
      type: [ Boolean, String ],
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    active () {
      return this.value === this.method.code
    }
  },
  methods: {
    price,
    onClick () {
      if (this.disabled) return
      this.$emit('input', this.method.code)
    }
  }
}
</script>
