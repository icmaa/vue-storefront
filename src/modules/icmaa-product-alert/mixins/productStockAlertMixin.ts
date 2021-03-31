import i18n from '@vue-storefront/i18n'
import { mapGetters } from 'vuex'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'

export default {
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      getChildProductIdByCurrentProductOption: 'icmaaProductAlert/getChildProductIdByCurrentProductOption'
    })
  },
  methods: {
    async addProductStockAlert (option, force = false): Promise<boolean> {
      if (!this.isLoggedIn && !force) {
        this.$store.dispatch('ui/showModal', 'modal-signup')
        this.onAfterLogin(option)
        return
      }

      const configurableChildId = this.getChildProductIdByCurrentProductOption(option)
      if (configurableChildId) {
        this.loading = true
        return this.$store.dispatch('icmaaProductAlert/addProductStockAlert', configurableChildId)
          .then(status => {
            this.loading = false
            if (status) {
              this.$store.dispatch('ui/closeAll')
              this.$store.dispatch('notification/spawnNotification', {
                type: 'success',
                message: i18n.t(
                  'You successfully subscribed yourself to this products stock notifications. You will receive updates about this product in future.'
                ),
                action1: { label: i18n.t('OK') }
              }, { root: true })
            }

            return status
          })
      }

      return false
    },
    onAfterLogin (option) {
      /** Somehow the isLoggedIn property is still false directly after login
         * so we use this `force` prop because we know that we are logged in */
      const afterLogin = async () => {
        await this.addProductStockAlert(option, true)
      }

      EventBus.$once('user-after-loggedin', afterLogin)
      this.$once('hook:destroyed', () => {
        EventBus.$off('user-after-loggedin', afterLogin)
      })
    }
  }
}
