<template>
  <div :class="['category-list']" v-if="list">
    <h1>{{ parent.name }}</h1>
    <ul>
      <li :key="category.slug" v-for="category in categories">
        {{ category.name }} - {{ category.slug }}
      </li>
    </ul>
  </div>
  <div v-else>
    <h1>No landing page found for ID {{ rootCategoryId }}</h1>
  </div>
</template>

<script>
import List from 'src/modules/icmaa-category/components/List'

export default {
  mixins: [ List ]
}
</script>
