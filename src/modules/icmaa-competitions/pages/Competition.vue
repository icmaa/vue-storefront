<template>
  <div
    v-if="competition && hasStarted"
    class="competition t-container"
  >
    <div class="t-mb-8 t-px-4 t-pt-4 lg:t-pt-8">
      <div class="t-mb-8 t-flex t-flex-wrap t-items-start lg:t-items-stretch">
        <PictureComponent
          :alt="competition.headline | stripHTML"
          :src="image"
          :width="624"
          :height="624"
          :placeholder="true"
          :sizes="sizes"
          ratio="1:1"
          class="t-w-full lg:t-w-1/2"
        />
        <div class="t-flex t-w-full t-flex-col t-justify-center t-bg-white t-p-8 lg:t-w-1/2">
          <h1
            v-if="competition.headline"
            class="t-mb-8 t-text-3xl t-font-light t-leading-tight t-text-primary lg:t-whitespace-pre-line"
            v-html="competition.headline"
          />
          <component
            :is="description"
            class="description t-text-sm t-leading-relaxed t-text-base-tone"
          />
          <div class="t-mt-8">
            <ButtonComponent
              v-scroll-to="'#competition-form'"
              type="ghost"
            >
              {{ competition.buttonText || $t('Participate now!') }}
            </ButtonComponent>
          </div>
        </div>
      </div>
      <div class="t-mb-8 t-flex t-flex-wrap">
        <div class="t-w-full lg:t-w-1/2">
          <div
            class="t-relative t-w-full t-bg-white"
            style="padding-top: 56.25%"
          >
            <iframe
              class="t-absolute t-top-0"
              width="100%"
              height="100%"
              :src="youtubeVideoUrl"
              frameborder="0"
              allowfullscreen
            />
          </div>
        </div>
        <div class="t-flex t-w-full t-pt-px lg:t-w-1/2 lg:t-pl-px lg:t-pt-0">
          <div class="t-relative t-flex-1 t-bg-white">
            <UniversalLink
              :to="competition.bannerLink"
              class="t-flex"
            >
              <PictureComponent
                :alt="competition.bannerLinkText | stripHTML"
                :src="bannerImage"
                :width="624"
                :height="312"
                :placeholder="true"
                :sizes="sizes"
                ratio="1:1"
                class="t-flex-1 t-self-start"
              />
            </UniversalLink>
            <UniversalLink
              :to="competition.bannerLink"
              class="t-flex t-w-full t-items-center t-bg-white t-p-4 t-text-xl t-text-primary lg:t-absolute lg:t-bottom-0 lg:t-px-6 lg:t-py-8"
            >
              <span
                class="t-flex-1"
                v-text="competition.bannerLinkText"
              />
              <MaterialIcon
                icon="keyboard_arrow_right"
                size="lg"
                class="t-ml-2 t-text-base-lighter"
              />
            </UniversalLink>
          </div>
        </div>
      </div>
      <FormComponent
        v-if="isActive && !isSend"
        id="competition-form"
        v-model="form"
        :form-elements="competition.form"
        :submit-button-text="$t('Submit') + (competition.disclaimer ? ' *' : '')"
        @submit="submit"
      />
      <div
        v-if="!isActive && !isSend"
        id="competition-form"
        class="t-bg-white t-p-4"
      >
        {{ $t('Sorry, but this competition is already over.') }}
      </div>
      <div
        v-if="isSend"
        class="t-bg-white t-p-4"
      >
        <div class="t-mb-2 t-flex t-items-center t-text-1xl t-font-bold t-text-alt-3">
          <MaterialIcon
            icon="check"
            size="lg"
            class="t-mr-2"
          />
          {{ $t('Done') }}
        </div>
        {{ $t('Thank you. We successfully received your data and will inform you about further steps.') }}
        <div
          v-if="successHeadline"
          class="t-mb-2 t-mt-8 t-flex t-items-center t-text-1xl t-text-primary"
        >
          {{ successHeadline }}
        </div>
        <div
          v-if="successImage"
          class="t-flex t-w-full"
        >
          <div class="lg:t-w-1/2">
            <PictureComponent
              :src="successImage"
              :width="624"
              :height="312"
              :placeholder="true"
              :sizes="sizes"
              ratio="1:1"
              class="t-flex-1 t-self-start"
            />
          </div>
        </div>
      </div>
      <div
        v-if="isActive && !isSend && competition.disclaimer"
        class="t-pt-4 t-text-sm t-text-base-light"
      >
        <p v-if="showTo">
          <MaterialIcon
            icon="asterisk"
            icon-set="icmaa"
            size="xxs"
            class="t-mr-1"
          />
          {{ $t('Deadline for entries is {showTo}. The decision is final.', { showTo }) }}
        </p>
        <p>
          <MaterialIcon
            v-if="showTo"
            icon="asterisk"
            icon-set="icmaa"
            size="xxs"
          />
          <MaterialIcon
            icon="asterisk"
            icon-set="icmaa"
            size="xxs"
            class="t-mr-1"
          />
          {{ competition.disclaimer }}
        </p>
      </div>
    </div>
  </div>
  <div
    v-else
    class="t-container"
  >
    <div class="t-p-4 lg:t-py-8">
      {{ $t('Sorry, but this competition has not yet started.') }}
    </div>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import { mapGetters } from 'vuex'
import { toDate, isDatetimeSameOrAfter, isDateInBetween } from 'icmaa-config/helpers/datetime'
import { stringToComponent } from 'icmaa-cms/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'

import FormComponent from 'theme/components/core/blocks/Form/Form'
import PictureComponent from 'theme/components/core/blocks/Picture'
import ButtonComponent from 'theme/components/core/blocks/Button'
import UniversalLink from 'theme/components/core/blocks/Link'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'Competition',
  components: {
    FormComponent,
    ButtonComponent,
    PictureComponent,
    UniversalLink,
    MaterialIcon
  },
  async asyncData ({ store, route, context }) {
    if (context) {
      context.output.cacheTags
        .add('competition')
    }

    const value = route.params.identifier
    await store.dispatch('icmaaCompetitions/single', { value })
  },
  data () {
    return {
      form: {},
      isSend: false
    }
  },
  computed: {
    ...mapGetters({
      getCompetition: 'icmaaCompetitions/getByIdentifier'
    }),
    competition () {
      return this.getCompetition(this.$route.params.identifier)
    },
    sheetId () {
      return this.competition.googleSheetId
    },
    hasStarted () {
      const { showFrom, enabled } = this.competition
      return enabled && isDatetimeSameOrAfter(showFrom)
    },
    isActive () {
      const { showFrom, showTo, enabled } = this.competition
      return enabled && isDateInBetween(showFrom, showTo)
    },
    description () {
      return stringToComponent(this.competition.description)
    },
    image () {
      return this.competition.image
    },
    bannerImage () {
      return this.competition.bannerImage
    },
    successHeadline () {
      return this.competition.successHeadline
    },
    successImage () {
      return this.competition.successImage
    },
    youtubeVideoUrl () {
      return `https://www.youtube.com/embed/${this.competition.youtubeVideoId}`
    },
    showTo () {
      return this.competition.showTo ? toDate(this.competition.showTo) : false
    },
    sizes () {
      return [
        // Order high-to-low is important
        { media: 'xl', width: 1248 },
        { media: 'lg', width: 992 },
        { media: 'sm', width: 768 },
        { media: 'xs', width: 640 },
        { width: 415 }
      ]
    }
  },
  methods: {
    async submit () {
      if (!this.isActive) {
        window.location.reload()
        return
      }

      this.$store.dispatch('ui/loader', { message: i18n.t('Please wait') })
      this.$store.dispatch('icmaaCompetitions/post', { sheetId: this.sheetId, data: this.form })
        .then(this.afterSend)
    },
    afterSend (success) {
      this.$store.dispatch('ui/loader', false)

      if (success) {
        this.isSend = true
        this.$store.dispatch('ui/loader', false)

        this.$store.dispatch('notification/spawnNotification', {
          type: 'success',
          message: i18n.t('Thank you. We successfully received your data and will inform you about further steps.'),
          action1: { label: i18n.t('OK') }
        })

        this.subscribeToNewsletter()
      } else {
        this.onError()
      }
    },
    onError () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: i18n.t('There was an unexpected error. Please check your entered data and try again.'),
        action1: { label: i18n.t('OK') }
      })
    },
    subscribeToNewsletter () {
      if (!this.form.newsletter || this.form.newsletter === false || !this.form.email) {
        return
      }

      return this.$store.dispatch('newsletter/subscribe', this.form.email).catch(err => {
        Logger.error('Error during newsletter-subscription after submit in: ' + this.competition.identifier, 'icmaa-competitions', err)()
      })
    }
  }
}
</script>

<style lang="scss">
@import '~theme/css/base/global_vars';

.competition {

  .description {
    a {
      color: $color-primary;
    }

    p, ul, ol {
      margin-bottom: 16px;
    }

    ul, ol {
      margin-left: 16px;

      li > p {
        margin-bottom: 0;
      }
    }

    ul {
      list-style: disc;
    }

    ol {
      list-style: decimal-leading-zero;
    }
  }
}

</style>
