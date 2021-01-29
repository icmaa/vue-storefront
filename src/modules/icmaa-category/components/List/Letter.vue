<template>
  <li>
    <h2 class="t-w-2/12 lg:t-w-1/12 t-px-2 t-pr-6 t-py-1 t-text-right t-text-3xl t-font-bold">
      {{ letter.letter }}
    </h2>
    <ul class="t-w-10/12 lg:t-w-11/12 t-px-2">
      <li v-for="category in letter.items" :key="category.name">
        <router-link
          :to="localizedRoute(category.url_path)"
          data-testid="categoryLink"
          v-html="category.name"
          class="t-block"
          :class="[ category.ceCluster === cluster ? 't-text-primary t-font-bold' : 't-text-base-tone' ]"
        />
      </li>
    </ul>
  </li>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'CategoryListLetter',
  props: {
    letter: {
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
