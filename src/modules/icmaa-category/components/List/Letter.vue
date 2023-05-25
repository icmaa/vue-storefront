<template>
  <li>
    <h2 class="t-w-2/12 t-px-2 t-py-1 t-pr-6 t-text-right t-text-3xl t-font-bold lg:t-w-1/12">
      {{ letter.letter }}
    </h2>
    <Lazyload
      class="t-flex-auto"
      @visible="visible"
    >
      <ul class="t-w-10/12 t-px-2 lg:t-w-11/12">
        <li
          v-for="category in letter.items"
          :key="category.name"
        >
          <router-link
            :to="localizedRoute(category.url_path)"
            data-testid="categoryLink"
            class="t-block"
            :class="[ category.ceCluster === cluster ? 't-font-bold t-text-primary' : 't-text-base-tone' ]"
          >
            {{ category.name }}
          </router-link>
        </li>
      </ul>
    </Lazyload>
  </li>
</template>

<script>

import { mapGetters } from 'vuex'
import Lazyload from 'icmaa-cms/components/Lazyload'

export default {
  name: 'CategoryListLetter',
  components: {
    Lazyload
  },
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
  },
  methods: {
    visible () {
      this.$emit('visible', this.letter)
    }
  }
}
</script>
