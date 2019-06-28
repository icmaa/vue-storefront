<template>
  <div :class="['category-list']" v-if="list">
    <h1>{{ parent.name }}</h1>
    <ul class="slingrope">
      <li :key="letter.letter" v-for="letter in categoriesGroupedByFirstLetter">
        <router-link :to="`#${letter.anchor}`">
          {{ letter.letter }}
        </router-link>
      </li>
    </ul>
    <ul class="letters">
      <li :key="letter.letter" v-for="letter in categoriesGroupedByFirstLetter" :id="letter.anchor" class="letter">
        <h2>{{ letter.letter }}</h2>
        <ul class="categories">
          <li :key="category.id" v-for="category in letter.list" class="category">
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
