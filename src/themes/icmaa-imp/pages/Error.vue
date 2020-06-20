<template>
  <div id="page_not_found" class="t-container">
    <div class="t-p-4 lg:t-py-8">
      <h2 class="t-text-lg t-font-bold t-text-primary">
        {{ $t("Something went wrong ...") }}
      </h2>
      <div class="t-text-sm t-text-base-dark">
        {{ $t("We've noticed Internal Server Error while rendering this request.") }}
      </div>
    </div>
  </div>
</template>

<script>
import Error from '@vue-storefront/core/pages/Error'

export default {
  name: 'Error',
  mixins: [Error]
}
</script>
