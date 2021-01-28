<template>
  <li>
    <h2 class="t-w-2/12 lg:t-w-1/12 t-px-2 t-pr-6 t-py-1 t-text-right t-text-3xl t-font-bold">
      {{ letter.letter }}
    </h2>
    <ul class="t-w-10/12 lg:t-w-11/12 t-px-2">
      <LetterItem v-for="category in letter.items" :key="category.name" :category="category" class="category t-inline-block t-w-full t-leading-snug t-py-1" />
    </ul>
  </li>
</template>

<script>

import LetterItem from 'icmaa-category/components/List/Item'

export default {
  name: 'CategoryListLetter',
  components: {
    LetterItem
  },
  props: {
    letter: {
      type: Object,
      required: true
    }
  }
}
</script>
