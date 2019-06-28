<template>
  <div :class="['category-list']" v-if="list">
    <h1>{{ parent.name }}</h1>
    <ul>
      <li :key="letter.letter" v-for="letter in categoriesGroupedByFirstLetter">
        {{ letter.letter }}
        <ul>
          <li :key="category.id" v-for="category in letter.list">
            <router-link
              :to="localizedRoute({ name: 'category', fullPath: category.url_path, params: { id: category.id, slug: category.slug }})"
              data-testid="categoryLink"
            >
              {{ category.name }}
            </router-link>
          </li>
        </ul>
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
