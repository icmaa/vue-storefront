<template>
  <router-link :to="localizedRoute({ name: 'home', path: '' })" :title="$t('Home Page')" class="t-no-underline">
    <img
      :width="width"
      :height="height"
      src="~/theme/assets/logo.svg"
      alt="Logo"
    >
  </router-link>
</template>

<script>
export default {
  props: {
    width: {
      type: [String, Number],
      required: true
    },
    height: {
      type: [String, Number],
      required: true
    }
  }
}
</script>
