<template>
  <div id="category-list" v-if="notEmpty">
    <ul class="slingrope t-flex t-overflow-auto t-scrolling-touch t-mx-4">
      <li :key="letter.letter" v-for="letter in categoriesGroupedByFirstLetter">
        <a :href="`#${ letter.anchor }`" v-html="letter.letter" v-scroll-to="`#${ letter.anchor }`" class="t-flex t-px-4 t-py-2 t-bg-white t-border-r t-border-b t-border-base-lightest t-font-mono" />
      </li>
    </ul>
    <ul class="letters t-px-6">
      <template v-for="letter in categoriesGroupedByFirstLetter">
        <letter :key="`${categoryId}-${letter.letter}`" :id="letter.anchor" :letter="letter" class="t-p-4 t-py-8 t-bg-white t-my-4 t-flex t--mx-2" />
      </template>
    </ul>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { extractPrefix } from 'icmaa-category/helpers'

import Letter from 'icmaa-category/components/List/Letter'

export default {
  name: 'IcmaaCategoryList',
  components: {
    Letter
  },
  props: {
    categoryId: {
      type: Number,
      required: true
    },
    depth: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      listByParentId: 'icmaaCategory/listByParentId'
    }),
    list () {
      return this.listByParentId(this.categoryId)
    },
    category () {
      return this.list.category
    },
    notEmpty () {
      return (this.list && this.list.items)
    },
    categoriesGroupedByFirstLetter () {
      let groups = []

      this.list.items.forEach(category => {
        let firstChar = extractPrefix(category.name).charAt(0)
        let letter = /^[a-z]/gmi.test(firstChar) ? firstChar.toUpperCase() : '#'

        if (!groups.find(g => g.letter === letter)) {
          let anchor = letter !== '#' ? letter.toLowerCase() : 'numbers'
          groups.push({ letter, anchor, items: [] })
        }

        groups[groups.findIndex(g => g.letter === letter)].items.push(category)
      })

      return groups
    }
  },
  methods: {
    async fetchData () {
      return this.$store.dispatch(
        'icmaaCategory/list',
        {
          id: this.categoryId,
          depth: this.depth
        }
      )
    }
  },
  watch: {
    categoryId () {
      this.fetchData()
    }
  },
  mounted () {
    this.fetchData()
  },
  async serverPrefetch () {
    await this.fetchData()
  }
}
</script>

<style lang="scss">

#category-list {
  .letters li {
    & > div.loader {
      height: 300px;
    }

    & > div:not(.loader) {
      @media (min-width: 767px) {
        column-count: 5;
        column-gap: 2rem;
        break-inside: avoid;
      }
    }
  }
}
</style>
