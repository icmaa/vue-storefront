<template>
  <Layout
    id="cms-page"
    :headline="content.headline"
  >
    <template v-if="!isSend">
      <p
        class="t-mb-2"
        v-html="content.text"
      />
      <p
        class="t-mb-4"
        v-html="content.subtext"
      />
      <FormComponent
        v-model="formData"
        form-identifier="widerruf-formular"
        @submit="submit"
      />
    </template>
    <div v-else>
      <p class="t-font-bold t-text-alt-3">
        {{ $t('Thank you, your email has successfully been sent.') }}
      </p>
      <p>{{ $t('Your revocation is now in progress.') }}</p>
    </div>
  </Layout>
</template>

<script>
import { mapGetters } from 'vuex'
import Page from 'icmaa-cms/mixins/Page'
import Layout from 'theme/pages/Cms/Service/Layout'
import FormComponent from 'icmaa-forms/components/Form'

import { mailer, icmaa } from 'config'
import i18n from '@vue-storefront/i18n'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { MailerModule } from '@vue-storefront/core/modules/mailer'

export default {
  name: 'ServiceWiderruf',
  components: {
    Layout,
    FormComponent
  },
  mixins: [ Page ],
  asyncData ({ store }) {
    return store.dispatch('icmaaCmsBlock/single', { value: 'service-navigation' })
  },
  data () {
    return {
      dataType: 'yaml',
      formData: {},
      isSend: false
    }
  },
  computed: {
    ...mapGetters({
      storeConfig: 'icmaaConfig/getCurrentStoreConfig'
    }),
    selectedSubjectHasChildren () {
      const subject = this.content.subjects.find(s => s.name === this.selectedSubject)
      return (subject && subject.hasOwnProperty('children'))
    },
    emailData () {
      const { order_number, order_date, widerruf_date, name, email, address } = this.formData
      const array = [
        { label: 'Bestellnummer:', value: order_number },
        { label: 'Bestellt am:', value: order_date },
        { label: 'Datum des Widerrufs:', value: widerruf_date },
        { label: 'Name, Vorname:', value: name },
        { label: 'Email:', value: email },
        { label: 'Adresse:', value: address }
      ]

      return array
        .filter(l => l.value.length > 0)
    },
    emailText () {
      return this.emailData
        .map(l => `${l.label}\n ${l.value}`)
        .join(`\n\n`)
    },
    emailHtml () {
      return this.emailData
        .map(l => `<strong>${l.label}</strong><br> ${l.value}`)
        .join(`<br><br>`)
    }
  },
  beforeCreate () {
    registerModule(MailerModule)
  },
  methods: {
    submit (success, failure) {
      this.$store.dispatch('ui/loader', { message: i18n.t('Please wait') })

      const targetAddress = icmaa.environment !== 'production'
        ? mailer.contactAddress : this.storeConfig.mailer.contactAddress || mailer.contactAddress

      const mail = {
        sourceAddress: `${this.formData.name} <${this.formData.email}>`,
        targetAddress,
        subject: 'Widerruf',
        text: this.emailText,
        html: this.emailHtml,
        ...this.formData
      }

      this.$store.dispatch('mailer/sendEmail', mail)
        .then(async (res) => {
          this.$store.dispatch('ui/loader', false)

          if (res.ok) {
            this.onSuccess()
          } else {
            res = await res.json()
            const errorPrefix = i18n.t('An error appeared:')
            this.onError(errorPrefix + ' ' + i18n.t(res.result))
          }
        })
        .catch(() => {
          this.$store.dispatch('ui/loader', false)
          this.onError(i18n.t('Could not send an email. Please try again later.'))
        })
    },
    onError (message) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: message,
        action1: { label: i18n.t('OK') }
      })
    },
    onSuccess () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: i18n.t('Email has successfully been sent.'),
        action1: { label: i18n.t('OK') }
      })

      this.formData = {}
      this.isSend = true
    }
  }
}
</script>
