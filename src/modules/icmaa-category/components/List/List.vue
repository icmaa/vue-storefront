<template>
  <div
    v-if="notEmpty"
    id="category-list"
  >
    <ul class="slingrope t-mx-4 t-flex t-overflow-auto t-scrolling-touch">
      <li
        v-for="letter in categoriesGroupedByFirstLetter"
        :key="letter.letter"
      >
        <a
          :href="`#${ letter.anchor }`"
          class="t-flex t-border-b t-border-r t-border-base-lightest t-bg-white t-px-4 t-py-2 t-font-mono"
          @click.prevent="scroll(letter)"
          v-html="letter.letter"
        />
      </li>
    </ul>
    <ul class="letters t-px-6">
      <template v-for="letter in categoriesGroupedByFirstLetter">
        <Letter
          :id="letter.anchor"
          :key="`${categoryId}-${letter.letter}`"
          :letter="letter"
          class="t--mx-2 t-my-4 t-flex t-bg-white t-p-4 t-py-8"
          @visible="visible"
        />
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
  data () {
    return {
      currentLetter: null
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
  watch: {
    categoryId () {
      this.fetchData()
    }
  },
  mounted () {
    this.fetchData()
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
    },
    scroll (letter) {
      this.currentLetter = letter
      document.getElementById(letter.anchor)
        .scrollIntoView({ behavior: 'smooth' })
    },
    visible () {
      if (this.currentLetter) {
        this.$nextTick(() => {
          this.scroll(this.currentLetter)
        })
      }
    }
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
