<template>
  <div>
    <router-link
      v-for="c in categories"
      :key="'filter-' + c.slug"
      size="sm"
      class="t-flex t-items-center t-webkit-tap-transparent t-flex-shrink-0 t-mr-2 t-opacity-75 hover:t-opacity-100 t-uppercase t-rounded-sm t-min-h-8 t-px-4 t-text-xs t-bg-base-darkest t-text-white t-justify-center"
      :to="localizedRoute(c.url_path)"
    >
      {{ c.label }}
    </router-link>
  </div>
</template>

<script>

export default {
  name: 'CategoryLinks',
  props: {
    categories: {
      type: Array,
      required: true
    }
  }
}
</script>
