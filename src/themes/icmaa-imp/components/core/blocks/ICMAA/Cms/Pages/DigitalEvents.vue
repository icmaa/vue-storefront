<template :class="content.backgroundcolor">
  <div class="t-container">
    <div class="t-flex t-flex-wrap t-px-4 t-mb-8">
      <!-- Header -->
      <div>
        <img :src="getMediaThumbnail(content.header.img, 0, 0)" :alt="content.header.alt" :title="content.header.alt">
      </div>

      <!-- Video -->
      <div class="t-relative t-w-full t-bg-white t-pb-4" style="padding-top: 56.25%">
        <iframe class="t-absolute t-top-0" width="100%" height="100%" :src="videoLink" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
      </div>

      <div class="t-bg-white t-py-8">
        <!-- Button -->
        <div v-if="buttonLink" class="t-flex t-flex-auto t-justify-center t-mb-4">
          <a :href="buttonLink">
            <button-component type="primary" size="md" class="t-w-full t-block t-text-white t-px-4 t-py-2">
              {{ buttonText }}
            </button-component>
          </a>
        </div>

        <!-- SEO text-->
        <div class="t-p-4">
          <p>{{ seoText }}</p>
        </div>
      </div>

      <!-- Tombola -->
      <div>
        <img :src="getMediaThumbnail(content.tombola.img, 0, 0)" :alt="content.tombola.alt" :title="content.tombola.alt">
      </div>

      <!-- Begin Mailchimp Signup Form -->
      <div id="mc_embed_signup" class="t-flex-auto t-flex t-justify-center t-bg-white">
        <form action="https://impericon.us2.list-manage.com/subscribe/post?u=d902fecd4afbea6dda59c4601&amp;id=805d00eda1" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
          <div id="mc_embed_signup_scroll">
            <div class="mc-field-group">
              <label class="form-label" for="mce-EMAIL">E-Mail Adresse  <span class="asterisk">*</span>
              </label>
              <input type="email" value="" placeholder="E-Mail Adresse *" name="EMAIL" class="input-text required email t-w-full t-h-10 t-px-3 t-border t-rounded-sm t-appearance-none t-text-sm t-leading-tight placeholder:t-text-base-light t-border-base-light" id="mce-EMAIL">
            </div>
            <div class="mc-field-group">
              <label class="form-label" for="mce-FNAME">Vorname </label>
              <input type="text" value="" placeholder="Vorname" name="FNAME" class="input-text t-w-full t-h-10 t-px-3 t-border t-rounded-sm t-appearance-none t-text-sm t-leading-tight placeholder:t-text-base-light t-border-base-light " id="mce-FNAME">
            </div>
            <div class="mc-field-group">
              <label class="form-label" placeholder="Nachname" for="mce-LNAME">Nachname </label>
              <input type="text" value="" placeholder="Nachname" name="LNAME" class="input-text t-w-full t-h-10 t-px-3 t-border t-rounded-sm t-appearance-none t-text-sm t-leading-tight placeholder:t-text-base-light t-border-base-light " id="mce-LNAME">
            </div>
            <div id="mce-responses" class="clear">
              <div class="response" id="mce-error-response" style="display:none" />
              <div class="response" id="mce-success-response" style="display:none" />
            </div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
            <div style="position: absolute; left: -5000px;" aria-hidden="true">
              <input type="text" name="b_d902fecd4afbea6dda59c4601_805d00eda1" tabindex="-1" value="">
            </div>
            <div class="clear">
              <input type="submit" value="Anmelden" name="anmelden" id="mc-embedded-subscribe" class="btn btn-primary t-flex t-items-center t-webkit-tap-transparent t-w-full t-mt-4 t-block t-text-white t-uppercase t-text-xs t-bg-primary t-text-white t-justify-center">
            </div>
          </div>
        </form>
      </div>
      <!--End mc_embed_signup-->

      <!-- Tombola hint-->
      <div class="t-flex t-flex-auto t-justify-center t-bg-white">
        <img :src="getMediaThumbnail(content.tombolahint.img, 0, 0)" :alt="content.tombolahint.alt" :title="content.tombolahint.alt">
      </div>

      <!-- Power Hour -->
      <div class="t-mb-4">
        <img :src="getMediaThumbnail(content.powerhour.img, 0, 0)" :alt="content.powerhour.alt" :title="content.powerhour.alt">
      </div>

      <!-- Partner -->
      <div class="t-mb-4">
        <h2 v-html="content.partnerheadline" />
        <div class="t-flex t-flex-wrap t-justify-center">
          <div v-for="partner in content.partners" :key="partner.name" class="t-block t-my-6">
            <a :href="partner.url">
              <img :src="getMediaThumbnail(partner.img, 0, 0)" :alt="partner.name" :title="partner.name">
            </a>
          </div>
        </div>
      </div>

      <!-- Teaser -->
      <div>
        <h2 v-html="content.teaserheadline" />
        <div class="t-flex t-flex-wrap t--mx-4 t-flex-full">
          <teaser :tags="content.teaser.tag" :show-large="false" :show-small-in-row="true" />
        </div>
      </div>

      <!-- Products -->
      <h2 v-html="content.productsheadline" />
      <lazy-hydrate when-visible>
        <product-listing-widget appearance="lg:t-p-0 t-p-0" :category-id="content.products.category_id" :limit="content.products.limit" />
      </lazy-hydrate>
    </div>
  </div>
</template>

<script>
import ButtonComponent from 'theme/components/core/blocks/Button'
import LazyHydrate from 'vue-lazy-hydration'
import Page from 'icmaa-cms/mixins/Page'
import ProductListingWidget from 'icmaa-category/components/core/ProductListingWidget'
import Teaser from 'theme/components/core/blocks/Teaser/Teaser'

import { mapGetters } from 'vuex'

export default {
  name: 'DigitalEvent',
  mixins: [ Page ],
  components: {
    ButtonComponent,
    ProductListingWidget,
    LazyHydrate,
    Teaser
  },
  data () {
    return {
      dataType: 'yaml'
    }
  },
  computed: {
    videoLink () {
      return this.content.video.link
    },
    seoText () {
      return this.content.seo_text || ''
    },
    buttonText () {
      return this.content.button.text || ''
    },
    buttonLink () {
      return this.content.button.link || ''
    }
  }
}
</script>
