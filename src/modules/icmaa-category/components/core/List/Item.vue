<template>
  <li>
    <router-link
      :to="localizedRoute(category.url_path)"
      data-testid="categoryLink"
      v-html="category.name"
      class="t-block"
      :class="[ category.ceCluster === cluster ? 't-text-primary t-font-bold' : 't-text-base-tone' ]"
    />
  </li>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'CategoryListItem',
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      cluster: 'user/getCluster'
    })
  }
}
</script>
