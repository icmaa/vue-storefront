<template>
  <div
    id="page_not_found"
    class="t-container"
  >
    <div class="t-flex t-flex-wrap t-justify-center t-px-4 t-py-8">
      <img
        class="t-mb-8 t-flex t-w-full t-flex-fix t-px-8 lg:t-mb-0 lg:t-w-1/3 lg:t-pr-20"
        src="/assets/404.svg"
        :alt="$t('404')"
      >
      <div class="t-flex t-w-full t-items-center t-bg-white t-p-8 t-text-sm t-text-base-tone lg:t-w-2/3 lg:t-self-center">
        <div class="t-w-full">
          <h2 class="t-mb-2 t-text-xl t-font-bold t-text-base-dark">
            {{ $t("Unfortunately we can't find the page you are looking for.") }}
          </h2>
          <i18n
            path="If you need assistance you can drop {link}."
            tag="p"
            class="t-mb-2 lg:t-mb-0"
          >
            <template #link>
              <router-link
                :to="localizedRoute(`/service`)"
                class="t-text-base-tone t-underline"
              >
                {{ $t('us a line here') }}
              </router-link>
            </template>
          </i18n>
          <i18n
            path="You can also use {link} to find anything you were looking for."
            tag="p"
            class="t-mb-4"
          >
            <template #link>
              <span
                class="t-cursor-pointer t-text-base-tone t-underline"
                @click="toggleSearchpanel"
              >{{ $t('our search') }}</span>
            </template>
          </i18n>
          <router-link
            :to="localizedHomeRoute"
            :title="$t('Home')"
          >
            <ButtonComponent
              class="t-w-full"
              type="primary"
            >
              <i class="material-icons t-mr-2">keyboard_backspace</i> {{ $t('Home') }}
            </ButtonComponent>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import { Logger } from '@vue-storefront/core/lib/logger'
import { removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'
import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'PageNotFound',
  components: {
    ButtonComponent
  },
  async asyncData ({ route, context }) {
    Logger.log('Entering asyncData for PageNotFound ' + new Date())()
    if (context) {
      context.output.cacheTags.add('page-not-found')
      context.output.cacheTags.add(`404-` + removeStoreCodeFromRoute(route?.path))
      context.server.response.statusCode = 404
    }
  },
  mounted () {
    IcmaaGoogleTagManagerExecutors.pageNotFound()
  },
  methods: {
    toggleSearchpanel () {
      this.$store.dispatch('ui/setSidebar', { key: 'searchpanel' })
    }
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
