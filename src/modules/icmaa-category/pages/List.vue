<template>
  <div :class="['category-list']">
    <h1>Sample landing page – {{ rootCategoryId }}</h1>
    <ul>
      <li :key="category.slug" v-for="category in categories">
        {{ category.name }} - {{ category.slug }}
      </li>
    </ul>
  </div>
</template>

<script>
import List from 'src/modules/icmaa-category/components/List'

export default {
  mixins: [ List ]
}
</script>
