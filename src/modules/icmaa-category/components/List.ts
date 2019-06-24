export default {
  name: 'IcmaaCategoryList',
  computed: {
    rootCategoryId () {
      return this.$route.params.parentCategoryId
    }
  }
}
