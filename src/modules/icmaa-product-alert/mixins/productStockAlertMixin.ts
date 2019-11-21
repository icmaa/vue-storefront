import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      getChildProductIdByCurrentProductOption: 'icmaaProductAlert/getChildProductIdByCurrentProductOption'
    })
  },
  methods: {
    async addProductStockAlert (option): Promise<boolean> {
      if (!this.isLoggedIn) {
        this.$bus.$emit('modal-toggle', 'modal-signup')
        return
      }

      const configurableChildId = this.getChildProductIdByCurrentProductOption(option)
      if (configurableChildId) {
        this.loading = true
        return this.$store.dispatch('icmaaProductAlert/addProductStockAlert', configurableChildId)
          .then(status => {
            this.loading = false
            return status
          })
      }

      return false
    }
  }
}
