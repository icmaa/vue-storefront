<template>
  <div id="page_not_found" class="t-container">
    <div class="t-px-4 t-py-8 t-flex t-flex-wrap t-justify-center">
      <img class="t-w-full lg:t-w-1/3 t-flex-fix t-flex t-px-8 t-mb-8 lg:t-mb-0 lg:t-pr-20"
           src="/assets/404.svg"
           :alt="$t('404')"
      >
      <div class="t-p-8 t-bg-white t-text-base-tone t-text-sm t-w-full lg:t-w-2/3 t-flex t-items-center lg:t-self-center">
        <div class="t-w-full">
          <h2 class="t-text-base-dark t-font-bold t-text-xl t-mb-2">
            {{ $t("Unfortunately we can't find the page you are looking for.") }}
          </h2>
          <i18n path="If you need assistance you can drop {link}." tag="p" class="t-mb-2 lg:t-mb-0">
            <template #link>
              <router-link :to="localizedRoute(`/service`)" class="t-text-base-tone t-underline" v-text="$t('us a line here')" />
            </template>
          </i18n>
          <i18n path="You can also use {link} to find anything you were looking for." tag="p" class="t-mb-4">
            <template #link>
              <span @click="toggleSearchpanel" class="t-cursor-pointer t-text-base-tone t-underline">{{ $t('our search') }}</span>
            </template>
          </i18n>
          <router-link :to="localizedHomeRoute" :title="$t('Home')">
            <button-component class="t-w-full" type="primary">
              <i class="t-mr-2 material-icons">keyboard_backspace</i> {{ $t('Home') }}
            </button-component>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import { Logger } from '@vue-storefront/core/lib/logger'
import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'PageNotFound',
  components: {
    ButtonComponent
  },
  methods: {
    toggleSearchpanel () {
      this.$store.dispatch('ui/setSidebar', { key: 'searchpanel' })
    }
  },
  async asyncData ({ store, route, context }) {
    Logger.log('Entering asyncData for PageNotFound ' + new Date())()
    if (context) {
      context.output.cacheTags.add(`page-not-found`)
      context.server.response.statusCode = 404
    }
  },
  mounted () {
    IcmaaGoogleTagManagerExecutors.pageNotFound()
  },
  metaInfo () {
    const description = this.$route.meta.description ? [{ vmid: 'description', name: 'description', content: this.$route.meta.description }] : []
    return {
      title: this.$route.meta.title || i18n.t('404 Page Not Found'),
      meta: [
        ...description,
        { vmid: 'robots', name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  }
}
</script>
