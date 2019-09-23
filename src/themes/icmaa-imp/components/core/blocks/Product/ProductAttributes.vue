<template>
  <li class="t-flex">
    <span class="t-w-2/6 t-font-bold">{{ label|htmlDecode }} </span>
    <span class="t-w-4/6">{{ value|htmlDecode }}</span>
  </li>
</template>

<script>
import { ProductAttribute } from '@vue-storefront/core/modules/catalog/components/ProductAttribute'

export default {
  mixins: [ProductAttribute]
}
</script>
