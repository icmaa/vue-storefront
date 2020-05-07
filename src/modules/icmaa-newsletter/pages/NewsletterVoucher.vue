<template>
  <div class="t-container">
    CREATE VOUCHER: {{ email }} – {{ rule }} - {{ voucher }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NewsletterVoucher',
  computed: {
    ...mapGetters({
      voucher: 'newsletter/getVoucher'
    }),
    email () {
      return this.$route.query.email
    },
    rule () {
      return this.$route.query.rule
    }
  },
  async asyncData ({ store, route }) {
    const email = route.params.email
    return store.dispatch('newsletter/getVoucher', { email, birthday: true })
  }
}
</script>
