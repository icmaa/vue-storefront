<template>
  <div
    id="product"
    data-test-id="product"
  >
    <div class="t-container t-px-4">
      <div class="t--mx-4 t-flex t-flex-wrap lg:t-px-4">
        <Breadcrumbs
          :show-active-route="false"
          class="breadcrumbs t-my-4 t-w-full t-px-4 md:t-my-8 md:t-px-0"
        />
        <ProductGallery
          :key="`product-gallery-${product.parentId}`"
          :gallery="gallery.map(i => i.src)"
          :product="product"
          class="t-w-full t-border-b t-border-base-lightest t-bg-white lg:t-w-1/2 lg:t-border-b-0"
        />
        <div
          :class="{ 'lg:t-flex lg:t-flex-col lg:t-justify-between': isPreorder }"
          class="t-w-full t-bg-white t-p-8 lg:t-w-1/2"
        >
          <CategoryExtrasHeader
            :linked-banner="true"
            :banner-sizes="categoryHeaderBannerSizes"
            :logo-limit="departmentLogoLimit"
            class="t--mx-8 t--mt-8 t-mb-8 t-border-b t-border-base-lightest lg:t-pl-px"
          >
            <div
              v-if="category"
              class="t-flex"
            >
              <ButtonComponent
                size="sm"
                @click="goToDepartmentCategory()"
              >
                {{ $t('More products') }}
              </ButtonComponent>
            </div>
          </CategoryExtrasHeader>
          <ProductPreorder
            v-if="isPreorder"
            :product="product"
          />
          <div class="t-flex t-flex-wrap">
            <h1
              data-test-id="productName"
              class="t-mb-0 t-w-1/2 t-grow t-leading-snug"
            >
              <DepartmentLogo
                v-if="departmentLogo"
                v-bind="departmentLogo.data()"
                class="t-float-right t-pl-4"
              />
              <template v-if="typeof productName === 'object'">
                <span class="t-mb-2 t-block t-text-2xl t-font-extralight t-leading-relaxed">{{ productName.mandant | htmlDecode }}</span>
                <span class="t-block t-text-lg t-font-bold">{{ productName.product | htmlDecode }}</span>
              </template>
              <template v-else>
                <span class="t-mb-2 t-block t-text-2xl t-font-extralight">{{ productName | htmlDecode }}</span>
              </template>
            </h1>
            <ReviewsShort
              :rating="reviewRating"
              :count="reviewCount"
              class="t-mt-4 t-w-full t-flex-fix lg:t-w-2/3 lg:t-flex-expand"
            />
            <WebShare
              :webshare-text="webshareText"
              :webshare-image="image.src"
              class="t-mt-4 t-w-full t-flex-fix t-text-base-light lg:t-w-auto"
            />

            <div class="t-w-full">
              <div
                v-if="product.type_id !== 'grouped'"
                class="price t-mb-8 t-mt-5 t-text-1xl"
                data-test-id="price"
              >
                <template v-if="product.special_price && product.price_incl_tax && product.original_price_incl_tax">
                  <span class="price-original t-text-base-tone t-line-through">{{ price(product.original_price_incl_tax * product.qty) }}</span>
                  &nbsp;
                  <span class="price-special t-font-bold t-text-sale">
                    <span
                      v-if="hasMultiplePrices"
                      class="t-text-sm"
                      v-text="$t('as low as')"
                    />
                    {{ price(product.price_incl_tax * product.qty) }}
                  </span>
                </template>
                <span
                  v-if="!product.special_price && product.price_incl_tax"
                  class="price t-font-bold"
                >
                  <span
                    v-if="hasMultiplePrices"
                    class="t-text-sm"
                    v-text="$t('as low as')"
                  />
                  {{ price(product.qty > 0 ? product.price_incl_tax * product.qty : product.price_incl_tax) }}
                </span>
                <div
                  class="t-mt-1 t-text-xs t-text-base-light"
                  v-html="taxDisclaimer"
                />
              </div>

              <div class="t-flex t-flex-wrap">
                <div
                  v-if="['configurable', 'bundle'].includes(product.type_id) && !isOnesizeProduct"
                  class="t-mb-4 t-flex t-w-full t-grow xl:t-mr-4 xl:t-w-3/6"
                >
                  <ButtonComponent
                    type="select"
                    icon="arrow_forward"
                    data-test-id="AddToCartSize"
                    class="t-w-full"
                    @click.native="openAddtocart"
                  >
                    {{ productOptionsLabel }}
                  </ButtonComponent>
                </div>
                <ButtonComponent
                  :type="loading || !isAddToCartDisabled ? 'primary' : 'second'"
                  :disabled="isAddToCartDisabled"
                  data-test-id="AddToCart"
                  class="t-relative t-mb-4 t-mr-4 t-grow disabled:t-opacity-50 xl:t-w-2/6"
                  @click.native="addToCartButtonClick"
                >
                  {{ userHasSelectedVariant && isAddToCartDisabled && !loading ? $t('Out of stock') : $t('Add to cart') }}
                  <LoaderBackground
                    v-if="loading"
                    class="t-bottom-0"
                    height="t-h-1"
                    bar="t-bg-base-lightest t-opacity-25"
                  />
                </ButtonComponent>
                <WishlistButton
                  :product="wishlistProduct"
                  class="t-mb-4 t-flex-fix"
                  data-test-id="CurrentProductWishlistButton"
                />
              </div>
              <ProductTrustSignals />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="t-container t-mt-8 t-px-4">
      <div class="t--mx-4 t-flex t-flex-wrap lg:t-px-4">
        <div class="product-details t-w-full t-bg-white t-p-8 lg:t-w-1/2">
          <DetailsTabs :tabs="detailsTabs">
            <template #pill-details>
              {{ $t('Product details') }}
            </template>
            <template #tab-details>
              <ProductDetails :product="product" />
            </template>
            <template #pill-features>
              {{ $t('Features') }}
            </template>
            <template #tab-features>
              <ProductFeatures :product="product" />
            </template>
            <template #pill-care-instructions>
              {{ $t('Care instructions') }}
            </template>
            <template #tab-care-instructions>
              <ProductCareInstructions :product="product" />
            </template>
          </DetailsTabs>
        </div>
        <div
          id="reviews"
          class="reviews t-relative t-w-full t-bg-base-lighter t-p-8 lg:t-w-1/2"
        >
          <Lazyload data-test-id="ReviewsLoader">
            <Reviews
              v-if="product"
              :product="product"
              :product-name="product.translatedName || product.name"
            />
            <ReviewsClaim />
          </Lazyload>
        </div>
      </div>
    </div>

    <div class="spacer t-h-8" />

    <div class="t-container t-px-4">
      <Lazyload data-test-id="RecommendationsLoader">
        <Recommendations
          :key="'crosssell-' + product.id"
          :title="$t('You may like these too')"
          type="crosssell"
          class="lg:t-mb-8"
        />
      </Lazyload>
      <Lazyload data-test-id="RecommendationsLoader">
        <Recommendations
          :key="'upsell-' + product.id"
          :title="$t('Similar products')"
          type="upsell"
          class="lg:t-mb-8"
        />
      </Lazyload>
    </div>

    <AsyncSidebar
      :state-key="'addtocart'"
      :async-component="AddToCartSidebar"
      :async-component-props="{ showAddToCartButton: true, closeOnSelect: false }"
    />

    <JsonLdLoader type="product" />
    <JsonLdLoader
      v-if="isTicket"
      type="ticket"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'

import { registerModule } from '@vue-storefront/core/lib/modules'
import { onlineHelper, isServer } from '@vue-storefront/core/helpers'
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks'
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers'
import * as productMutationTypes from '@vue-storefront/core/modules/catalog/store/product/mutation-types'

import { ReviewModule } from '@vue-storefront/core/modules/review'
import { IcmaaExtendedReviewModule } from 'icmaa-review'
import Reviews from 'theme/components/core/blocks/Reviews/Reviews'

import AsyncSidebar from 'theme/components/core/blocks/AsyncSidebar/AsyncSidebar'
import IcmaaProduct from 'icmaa-catalog/components/Product'
import Breadcrumbs from 'theme/components/core/Breadcrumbs'
import ProductGallery from 'theme/components/core/blocks/Product/ProductGallery'
import WebShare from 'theme/components/core/blocks/WebShare'
import ButtonComponent from 'theme/components/core/blocks/Button'
import WishlistButton from 'theme/components/core/blocks/Wishlist/WishlistButton'
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
import JsonLdLoader from 'icmaa-google-tag-manager/components/jsonld/JsonLdLoader'
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
    WishlistButton,
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
    JsonLdLoader,
    WebShare,
    Lazyload
  },
  mixins: [IcmaaProduct, ProductMetaMixin, ProductPriceMixin, ProductOptionsMixin, ProductAddToCartMixin, FeaturesMixin, ClusterMixin],
  async asyncData ({ store, route }) {
    store.commit('product/' + productMutationTypes.PRODUCT_RESET_CURRENT, {})
    const product = await store.dispatch('product/loadProduct', { parentSku: route.params.parentSku, childSku: route && route.params && route.params.childSku ? route.params.childSku : null })
    const loadBreadcrumbsPromise = store.dispatch('product/loadProductBreadcrumbs', { product })
    if (isServer) {
      await loadBreadcrumbsPromise
    }
  },
  data () {
    return {
      AddToCartSidebar,
      quantity: 0,
      loading: false,
      userHasSelectedVariant: false
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
    wishlistProduct () {
      return Object.assign({}, this.product, {
        sku: this.product.parentSku,
        id: this.product.parentId
      })
    },
    isPreorder () {
      return this.product.promo_id === '5'
    },
    isTicket () {
      return (this.product.type_id === 'simple' && !!this.product.ticket_address)
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
    taxDisclaimer () {
      return i18n.t(
        '{incl} VAT, Excl. shipping',
        { incl: i18n.t('incl.') }
      )
    },
    departmentLogoLimit () {
      return this.viewport === 'sm' ? 4 : 5
    },
    categoryHeaderBannerSizes () {
      return [
        // Order high-to-low is important
        { media: 'xl', width: 624 },
        { media: 'lg', width: 496 },
        { media: 'sm', width: 768 },
        { media: 'xs', width: 640 },
        { width: 415 }
      ]
    }
  },
  watch: {
    product (nProduct, oProduct) {
      if (nProduct && nProduct.id && nProduct.id !== oProduct.id) {
        this.getQuantity()
        this.userHasSelectedVariant = false
      }

      if (nProduct.parentId) {
        catalogHooksExecutors.productPageVisited(nProduct)
      }
    }
  },
  beforeCreate () {
    registerModule(ReviewModule)
    registerModule(IcmaaExtendedReviewModule)
  },
  async mounted () {
    await this.getQuantity()
    catalogHooksExecutors.productPageVisited(this.product)
  },
  created () {
    if (!isServer) {
      const selectVariantCallback = () => { this.userHasSelectedVariant = true }
      this.$bus.$on('user-has-selected-product-variant', selectVariantCallback)
      this.$once('hook:beforeDestroy', () => {
        this.$bus.$off('user-has-selected-product-variant', selectVariantCallback)
      })
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
  }
}
</script>
