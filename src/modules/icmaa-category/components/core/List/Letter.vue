<template>
  <li>
    <h2 class="t-w-2/12 lg:t-w-1/12 t-px-2 t-pr-6 t-py-1 t-text-right t-text-3xl t-font-bold">
      {{ letter }}
    </h2>
    <ul class="t-w-10/12 lg:t-w-11/12 t-px-2">
      <LetterItem v-for="category in items" :key="category.id" :category="category" class="category t-inline-block t-w-full t-leading-snug t-py-1" />
    </ul>
  </li>
</template>

<script>

import { mapGetters } from 'vuex'

import LazyHydrate from 'vue-lazy-hydration'
import LetterItem from 'icmaa-category/components/core/List/Item'

export default {
  name: 'CategoryListLetter',
  components: {
    LetterItem,
    LazyHydrate
  },
  props: {
    letter: {
      type: String,
      required: true
    },
    chars: {
      type: Array,
      default: () => []
    },
    parentId: {
      type: Number,
      required: true
    },
    depth: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      listByParentId: 'icmaaCategory/listByParentId'
    }),
    list () {
      return this.listByParentId(this.parentId)
    },
    items () {
      if (this.list) {
        return this.list.list[this.letter] || false
      }

      return false
    }
  },
  async mounted () {
    const { parentId, depth } = this
    const letters = [this.letter, ...this.chars]
    await this.$store.dispatch('icmaaCategory/loadListCategories', { parentId, depth, letters })

    this.loading = false
  }
}
</script>
