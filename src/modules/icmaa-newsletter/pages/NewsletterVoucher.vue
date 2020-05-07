<template>
  <div class="t-container">
    CREATE VOUCHER ({{ isBirthday }}): {{ email }} - {{ voucher }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NewsletterVoucher',
  props: {
    isBirthday: {
      type: Boolean,
      default: false
    }
  },
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
  async serverPrefetch () {
    this.$store.dispatch('newsletter/getVoucher', { email: this.email, rule: this.rule, birthday: this.isBirthday })
  },
  async mounted () {
    if (!this.voucher) {
      this.$store.dispatch('newsletter/getVoucher', { email: this.email, rule: this.rule, birthday: this.isBirthday })
    }
  }
}
</script>
