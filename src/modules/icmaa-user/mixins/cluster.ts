import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      categoryExtras: 'icmaaCategoryExtras/getCategoryExtrasByCurrentCategory',
      category: 'category-next/getCurrentCategory'
    })
  },
  methods: {
    setCluster () {
      if (this.categoryExtras?.cluster) {
        this.$store.dispatch('user/setCluster', { value: this.categoryExtras.cluster })
      }
    }
  },
  mounted () {
    this.setCluster()
  },
  watch: {
    category () {
      this.setCluster()
    }
  }
}
