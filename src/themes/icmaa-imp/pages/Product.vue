<template>
  <div id="product" data-test-id="product">
    <div class="t-container t-px-4">
      <div class="t--mx-4 lg:t-px-4 t-flex t-flex-wrap">
        <breadcrumbs class="breadcrumbs t-w-full t-my-8 t-hidden lg:t-flex" />
        <category-extras-header class="t-bg-white t-border-b t-border-base-lightest" v-if="['xs', 'sm', 'md'].includes(viewport)" :linked-banner="true" :banner-sizes="categoryHeaderBannerSizes" :spotify-logo-limit="spotifyLogoLimit" />
        <product-gallery
          class="product-gallery t-w-full t-border-base-lightest t-border-b t-bg-white lg:t-w-1/2 lg:t-border-b-0"
          :gallery="gallery.map(i => i.src)"
          :configuration="configuration"
          :product="product"
        />
        <div class="t-w-full t-p-8 t-bg-white lg:t-w-1/2" :class="{ 'lg:t-flex lg:t-flex-col lg:t-justify-between': isPreorder }">
          <category-extras-header class="t--mx-8 t--mt-8 t-mb-8 lg:t-pl-px t-border-b t-border-base-lightest" v-if="!['xs', 'sm', 'md'].includes(viewport)" :linked-banner="true" :banner-sizes="categoryHeaderBannerSizes" :spotify-logo-limit="spotifyLogoLimit">
            <div class="t-flex" v-if="category">
              <button-component size="sm" @click="goToDepartmentCategory()">
                {{ $t('More product\'s') }}
              </button-component>
            </div>
          </category-extras-header>
          <div class="t-flex t-flex-wrap">
            <h1 data-test-id="productName" class="t-flex-grow t-w-1/2 t-mb-0 t-leading-snug">
              <department-logo v-bind="departmentLogo.data()" v-if="departmentLogo" class="t-float-right t-pl-4" />
              <template v-if="typeof productName === 'object'">
                <span class="t-block t-text-2xl t-font-thin t-leading-relaxed t-mb-2">{{ productName.mandant | htmlDecode }}</span>
                <span class="t-block t-text-lg t-font-bold">{{ productName.product | htmlDecode }}</span>
              </template>
              <template v-else>
                <span class="t-block t-text-2xl t-font-thin t-mb-2">{{ productName | htmlDecode }}</span>
              </template>
            </h1>
            <reviews-short :rating="reviewsTotalRating" :count="reviewsCount" class="t-flex-fix t-w-full t-mt-4 lg:t-flex-expand lg:t-w-2/3" />
            <web-share :webshare-text="webshareText" :webshare-image="image.src" class="t-flex-fix t-w-full t-mt-4 t-text-base-light lg:t-w-auto" />

            <div class="t-w-full">
              <div v-if="product.type_id !== 'grouped'" class="price t-mt-5 t-mb-8 t-text-1xl" data-test-id="price">
                <template v-if="product.special_price && product.price_incl_tax && product.original_price_incl_tax">
                  <span class="price-original t-text-base-tone t-line-through">{{ price(product.original_price_incl_tax * product.qty) }}</span>
                  &nbsp;
                  <span class="price-special t-text-sale t-font-bold">
                    <span v-if="hasMultiplePrices" v-text="$t('as low as')" class="t-text-sm" />
                    {{ price(product.price_incl_tax * product.qty) }}
                  </span>
                </template>
                <span class="price t-font-bold" v-if="!product.special_price && product.price_incl_tax">
                  <span v-if="hasMultiplePrices" v-text="$t('as low as')" class="t-text-sm" />
                  {{ price(product.qty > 0 ? product.price_incl_tax * product.qty : product.price_incl_tax) }}
                </span>
                <div class="t-mt-1 t-text-xs t-text-base-light" v-html="taxDisclaimer" />
              </div>

              <div class="t-flex t-flex-wrap">
                <div v-if="['configurable', 'bundle'].includes(product.type_id) && !isOnesizeProduct" class="t-flex t-flex-grow t-w-full t-mb-4 xl:t-w-3/6 xl:t-mr-4">
                  <button-component type="select" icon="arrow_forward" data-test-id="AddToCartSize" class="t-w-full" @click.native="openAddtocart">
                    {{ productOptionsLabel }}
                  </button-component>
                </div>
                <button-component :type="loading || !isAddToCartDisabled ? 'primary' : 'second'" data-test-id="AddToCart" class="t-flex-grow xl:t-w-2/6 disabled:t-opacity-50 t-relative t-mb-4 t-mr-4" :disabled="isAddToCartDisabled" @click.native="addToCartButtonClick">
                  {{ userHasSelectedVariant && isAddToCartDisabled && !loading ? $t('Out of stock') : $t('Add to cart') }}
                  <loader-background v-if="loading" class="t-bottom-0" height="t-h-1" bar="t-bg-base-lightest t-opacity-25" />
                </button-component>
                <add-to-wishlist :product="product" class="t-flex-fix t-mb-4" />
              </div>
              <product-trust-signals />
            </div>
          </div>
          <product-preorder v-if="isPreorder" :product="product" />
        </div>
      </div>
    </div>

    <div class="t-container t-px-4 t-mt-8">
      <div class="t--mx-4 lg:t-px-4 t-flex t-flex-wrap">
        <div class="product-details t-w-full t-p-8 t-bg-white lg:t-w-1/2">
          <details-tabs :tabs="detailsTabs">
            <template #pill-details>
              {{ $t('Product details') }}
            </template>
            <template #tab-details>
              <product-details :product="product" />
            </template>
            <template #pill-features>
              {{ $t('Features') }}
            </template>
            <template #tab-features>
              <product-features :product="product" />
            </template>
            <template #pill-care-instructions>
              {{ $t('Care instructions') }}
            </template>
            <template #tab-care-instructions>
              <product-care-instructions :product="product" />
            </template>
          </details-tabs>
        </div>
        <div class="reviews t-relative t-w-full t-p-8 t-bg-base-lighter lg:t-w-1/2" id="reviews">
          <lazyload>
            <reviews :product="product" :product-name="translatedProductName" v-show="isOnline" />
            <reviews-claim />
          </lazyload>
        </div>
      </div>
    </div>

    <div class="spacer t-h-8" />

    <lazyload>
      <div class="t-container t-px-4">
        <recommendations type="crosssell" :title="$t('You may like these too')" class="lg:t-mb-8" />
        <recommendations type="upsell" :title="$t('Similar products')" class="lg:t-mb-8" />
      </div>
    </lazyload>

    <async-sidebar
      :state-key="'addtocart'"
      :async-component="AddToCartSidebar"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import i18n from '@vue-storefront/i18n'

import { registerModule } from '@vue-storefront/core/lib/modules'
import { onlineHelper, isServer } from '@vue-storefront/core/helpers'
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers'
import * as productMutationTypes from '@vue-storefront/core/modules/catalog/store/product/mutation-types'

import { ReviewModule } from '@vue-storefront/core/modules/review'
import { IcmaaExtendedReviewModule } from 'icmaa-review'
import { RecentlyViewedModule } from '@vue-storefront/core/modules/recently-viewed'
import Reviews from 'theme/components/core/blocks/Reviews/Reviews'

import AsyncSidebar from 'theme/components/core/blocks/AsyncSidebar/AsyncSidebar'
import IcmaaProduct from 'icmaa-catalog/components/Product'
import Breadcrumbs from 'theme/components/core/Breadcrumbs'
import ProductGallery from 'theme/components/core/ProductGallery'
import WebShare from 'theme/components/core/blocks/WebShare'
import ButtonComponent from 'theme/components/core/blocks/Button'
import AddToWishlist from 'theme/components/core/blocks/Wishlist/AddToWishlist'
import CategoryExtrasHeader from 'theme/components/core/blocks/CategoryExtras/Header'
import DepartmentLogo from 'theme/components/core/blocks/CategoryExtras/DepartmentLogo'
import DetailsTabs from 'theme/components/core/blocks/Product/Tabs'
import ProductTrustSignals from 'theme/components/core/blocks/Product/ProductTrustSignals'
import ProductPreorder from 'theme/components/core/blocks/Product/ProductPreorder'
import ProductDetails from 'theme/components/core/blocks/Product/ProductDetails'
import ProductFeatures from 'theme/components/core/blocks/Product/ProductFeatures'
import ProductCareInstructions from 'theme/components/core/blocks/Product/ProductCareInstructions'
import ReviewsShort from 'theme/components/core/blocks/Reviews/ReviewsShort'
import ReviewsClaim from 'theme/components/core/blocks/Reviews/ReviewsClaim'
import Recommendations from 'icmaa-recommendations/components/Recommendations'
import LoaderBackground from 'theme/components/core/LoaderBackground'
import Lazyload from 'icmaa-cms/components/Lazyload'

import ProductMetaMixin from 'icmaa-meta/mixins/productMeta'
import ProductPriceMixin from 'theme/mixins/product/priceMixin'
import ProductOptionsMixin from 'theme/mixins/product/optionsMixin'
import ProductAddToCartMixin from 'theme/mixins/product/addtocartMixin'
import FeaturesMixin from 'theme/mixins/product/featuresMixin'
import ClusterMixin from 'icmaa-user/mixins/cluster'

const AddToCartSidebar = () => import(/* webpackPreload: true */ /* webpackChunkName: "vsf-addtocart-sidebar" */ 'theme/components/core/blocks/AddToCartSidebar/AddToCartSidebar')

export default {
  name: 'Product',
  components: {
    AsyncSidebar,
    AddToWishlist,
    Breadcrumbs,
    DepartmentLogo,
    CategoryExtrasHeader,
    ButtonComponent,
    LoaderBackground,
    ProductGallery,
    DetailsTabs,
    ProductTrustSignals,
    ProductPreorder,
    ProductDetails,
    ProductFeatures,
    ProductCareInstructions,
    Reviews,
    ReviewsShort,
    ReviewsClaim,
    Recommendations,
    WebShare,
    Lazyload
  },
  mixins: [IcmaaProduct, ProductMetaMixin, ProductPriceMixin, ProductOptionsMixin, ProductAddToCartMixin, FeaturesMixin, ClusterMixin],
  beforeCreate () {
    registerModule(ReviewModule)
    registerModule(IcmaaExtendedReviewModule)
    registerModule(RecentlyViewedModule)
  },
  data () {
    return {
      AddToCartSidebar,
      quantity: 0,
      loading: false,
      userHasSelectedVariant: false
    }
  },
  created () {
    this.getQuantity()

    this.$bus.$on('user-has-selected-product-variant', () => {
      this.userHasSelectedVariant = true
    })
  },
  watch: {
    product (newVal, oldVal) {
      if (newVal.id !== oldVal.id) {
        this.getQuantity()
        this.userHasSelectedVariant = false
      }
    }
  },
  computed: {
    ...mapGetters({
      category: 'category-next/getCurrentCategory',
      product: 'product/getCurrentProduct',
      gallery: 'product/getProductGallery',
      configuration: 'product/getCurrentProductConfiguration',
      isCurrentBundleOptionsSelection: 'product/isCurrentBundleOptionsSelection',
      currentBundleOptions: 'product/getCurrentBundleOptions',
      viewport: 'ui/getViewport'
    }),
    image () {
      return this.gallery.length ? this.gallery[0] : false
    },
    isAddToCartDisabled () {
      if (this.isBundle) {
        return this.$v.$invalid || this.loading
      }

      return this.$v.$invalid || this.loading || !this.quantity
    },
    isPreorder () {
      return this.product.promo_id === '5'
    },
    hasConfiguration () {
      return this.configuration && Object.keys(this.configuration).length > 0 && this.userHasSelectedVariant
    },
    productOptionsLabel () {
      if (this.hasConfiguration && this.product.options.length > 0) {
        return this.product.options.map(o => o.value).join(', ')
      } else if (this.isBundle && this.isCurrentBundleOptionsSelection) {
        const labels = []
        this.product.bundle_options.forEach(option => {
          const currentBundleOption = this.currentBundleOptions[option.option_id] || { option_selections: [] }
          currentBundleOption.option_selections.forEach(id => {
            const productLink = option.product_links.find(productLink => productLink.id === id)
            if (option.configurable_options && option.configurable_options.length > 0) {
              const attributeKey = option.configurable_options[0]['attribute_code']
              labels.push(this.getOptionLabel({ attributeKey, optionId: productLink[attributeKey] }))
            } else {
              labels.push(option.title || productLink.product.name)
            }
          })
        })

        return labels.join(' + ')
      }

      return this.productOptionsLabelPlaceholder
    },
    detailsTabs () {
      let tabs = ['details']

      if (this.hasFeatures) {
        tabs.push('features')
      }

      if (this.product.features_care && this.product.features_care.join('') !== '') {
        tabs.push('care-instructions')
      }

      return tabs
    },
    isOnline () {
      return onlineHelper.isOnline
    },
    taxrate () {
      const storeView = currentStoreView()
      return storeView.tax.defaultRate
    },
    taxDisclaimer () {
      return i18n.t(
        '{incl} {rate}% VAT, Excl. shipping',
        { rate: this.taxrate, incl: i18n.t('incl.') }
      )
    },
    spotifyLogoLimit () {
      return this.viewport === 'sm' ? 4 : 5
    },
    categoryHeaderBannerSizes () {
      return [
        // Order high-to-low is important
        { media: '(min-width: 1280px)', width: 624 },
        { media: '(min-width: 1024px)', width: 496 },
        { media: '(min-width: 640px)', width: 768 },
        { media: '(min-width: 415px)', width: 640 },
        { media: '(max-width: 415px)', width: 415 }
      ]
    }
  },
  methods: {
    openAddtocart () {
      this.$store.dispatch('ui/setSidebar', { key: 'addtocart' })
    },
    addToCartButtonClick () {
      if (!this.loading) {
        if (this.isSingleOptionProduct || this.hasConfiguration || (this.isBundle && this.isCurrentBundleOptionsSelection)) {
          this.loading = true
          this.addToCart(this.product)
            .then(() => { this.loading = false })
            .catch(() => { this.loading = false })

          return
        }

        this.openAddtocart()
      }
    },
    goToDepartmentCategory () {
      this.$router.push(formatCategoryLink(this.departmentCategory))
    }
  },
  async asyncData ({ store, route }) {
    store.commit('product/' + productMutationTypes.PRODUCT_RESET_CURRENT, {})
    const product = await store.dispatch('product/loadProduct', { parentSku: route.params.parentSku, childSku: route && route.params && route.params.childSku ? route.params.childSku : null })
    const loadBreadcrumbsPromise = store.dispatch('product/loadProductBreadcrumbs', { product })
    if (isServer) {
      await loadBreadcrumbsPromise
    }
  },
  mounted () {
    catalogHooksExecutors.productPageVisited(this.product)
  }
}
</script>
