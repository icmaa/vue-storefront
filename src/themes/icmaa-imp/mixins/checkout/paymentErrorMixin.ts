import get from 'lodash-es/get'
import omit from 'lodash-es/omit'

export default {
  beforeMount () {
    if (this.$route.query && this.$route.query.paymentFailure) {
      const errorMsg = get(this.$route, 'query.message', 'Something went wrong. Payment was not successful.')

      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t(errorMsg),
        action1: { label: this.$t('OK') }
      }, { root: true })

      const query = omit(this.$route.query, ['paymentFailure', 'message'])

      this.$router.replace({
        ...this.$route,
        query
      })
    }
  }
}
