export default {
  methods: {
    async addProductStockAlert (product, option): Promise<boolean> {
      const confChild = product.configurable_children.find(c => c[option.type] === option.id)
      if (confChild) {
        return this.$store.dispatch('icmaaProductAlert/addProductStockAlert', confChild.id)
      }

      return false
    }
  }
}
