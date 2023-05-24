<template>
  <div>
    <router-link
      v-for="c in categories"
      :key="'filter-' + c.slug"
      size="sm"
      class="t-mr-2 t-flex t-min-h-8 t-shrink-0 t-items-center t-justify-center t-rounded-sm t-bg-base-darkest t-px-4 t-text-xs t-uppercase t-text-white t-opacity-75 t-webkit-tap-transparent hover:t-opacity-100"
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
