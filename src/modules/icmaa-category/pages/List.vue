<template>
  <div :class="['category-list']">
    Sample landing page – {{ rootCategoryId }}
  </div>
</template>

<script>
import List from 'src/modules/icmaa-category/components/List'
import { Logger } from '@vue-storefront/core/lib/logger';

export default {
  mixins: [ List ]
}
</script>
