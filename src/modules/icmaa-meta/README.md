# `icmaa-meta` module

Set store and logic for meta- and seo information.

In `theme/resource/meta/` you need to add files like `head-uk.ts` to add a store-view specific meta file where you can extend the default meta infos of `theme/resource/meta/head.ts`. This data will be loaded on serverPrefetch into the root state and loaded in your layout.

## Config

1. Fetch state in default layout file of your theme (e.g. `Default.vue`) via `serverPrefetch()` like `this.$store.dispatch('icmaaMeta/load')`. Be sure to return a `promise` in `serverPrefetch()`, so if you fetch multiple actions it should look like:
   ```javascript
   return Promise.all([
     this.fetchMetaData(), // Method which fetches the data via vuex store
     this.otherData()
   ])
   ```
2. Import meta info via getter like:
   ```javascript
   methods: {
     ...mapGetters({ getMetaData: 'icmaaMeta/getData' })
   },
   metaInfo () {
     return this.getMetaData()
   }
   ```

## Todo

[ ] Make config via `icmaa-cms` available
