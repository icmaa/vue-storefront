<template>
  <div
    id="page_not_found"
    class="t-container"
  >
    <div class="t-p-4 t-py-8">
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

export default {
  name: 'Error',
  metaInfo () {
    return {
      meta: [
        { vmid: 'robots', name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  }
}

</script>
