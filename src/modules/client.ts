import { VueStorefrontModule } from '@vue-storefront/core/lib/module'
import { CatalogModule } from '@vue-storefront/core/modules/catalog'
import { CatalogNextModule } from '@vue-storefront/core/modules/catalog-next'
import { CartModule } from '@vue-storefront/core/modules/cart'
import { CompareModule } from '@vue-storefront/core/modules/compare'
import { WishlistModule } from '@vue-storefront/core/modules/wishlist'
import { NotificationModule } from '@vue-storefront/core/modules/notification'
import { UrlModule } from '@vue-storefront/core/modules/url'
import { BreadcrumbsModule } from '@vue-storefront/core/modules/breadcrumbs'
import { UserModule } from '@vue-storefront/core/modules/user'
import { NewsletterModule } from '@vue-storefront/core/modules/newsletter'
import { InitialResourcesModule } from '@vue-storefront/core/modules/initial-resources'
import { registerModule } from '@vue-storefront/core/lib/modules'

// ICMAA Modules
import { IcmaaExtendedConfigModule } from 'icmaa-config'
import { IcmaaExtendedUrlModule } from 'icmaa-url'
import { IcmaaExtendedCatalogModule } from 'icmaa-catalog'
import { IcmaaExtendedUserModule } from 'icmaa-user'
import { IcmaaExtendedCartModule } from 'icmaa-cart'
import { IcmaaExtendedNewsletterModule } from 'icmaa-newsletter'
import { IcmaaExtendedWishlistModule } from 'icmaa-wishlist'
import { IcmaaExtendedReviewRoutes } from 'icmaa-review'
import { IcmaaCategoryModule } from 'icmaa-category'
import { IcmaaCategoryExtrasModule } from 'icmaa-category-extras'
import { IcmaaCheckoutModule } from 'icmaa-checkout'
// import { IcmaaExternalCheckoutModule } from 'icmaa-external-checkout'
import { IcmaaCdnModule } from 'icmaa-cdn'
import { IcmaaCmsModule } from 'icmaa-cms'
import { IcmaaFormsModule } from 'icmaa-forms'
import { IcmaaTeaserModule } from 'icmaa-teaser'
import { IcmaaAdviceModule } from 'icmaa-advice'
import { IcmaaMetaModule } from 'icmaa-meta'
import { IcmaaRecommendationsModule } from 'icmaa-recommendations'
import { IcmaaCompetitionsModule } from 'icmaa-competitions'
import { IcmaaSpotifyModule } from 'icmaa-spotify'
import { IcmaaProductAlertModule } from 'icmaa-product-alert'
import { IcmaaGiftcertModule } from 'icmaa-giftcert'
import { IcmaaTrackingModule } from 'icmaa-tracking'
import { IcmaaLooksModule } from 'icmaa-looks'
import { IcmaaPayPalModule } from 'icmaa-paypal'
import { IcmaaGoogleTagManagerModule } from 'icmaa-google-tag-manager'
import { IcmaaLogsModule } from 'icmaa-logs'

// TODO:distributed across proper pages BEFORE 1.11
export function registerClientModules () {
  registerModule(UrlModule)
  registerModule(CatalogModule)
  // Replaced by our module (order is important)
  // registerModule(CheckoutModule)
  registerModule(IcmaaCheckoutModule)
  // registerModule(IcmaaExternalCheckoutModule)
  registerModule(CartModule)
  registerModule(WishlistModule) // Trigger on wishlist icon click
  registerModule(NotificationModule)
  registerModule(UserModule) // Trigger on user icon click
  registerModule(CatalogNextModule)
  registerModule(CompareModule)
  registerModule(BreadcrumbsModule)
  registerModule(NewsletterModule)
  registerModule(InitialResourcesModule)
  // ICMAA Modules
  registerModule(IcmaaExtendedConfigModule)
  registerModule(IcmaaExtendedUrlModule)
  registerModule(IcmaaExtendedCatalogModule)
  registerModule(IcmaaExtendedUserModule)
  registerModule(IcmaaExtendedCartModule)
  registerModule(IcmaaExtendedNewsletterModule)
  registerModule(IcmaaExtendedWishlistModule)
  registerModule(IcmaaExtendedReviewRoutes)
  registerModule(IcmaaCategoryModule)
  registerModule(IcmaaCategoryExtrasModule)
  registerModule(IcmaaCdnModule)
  registerModule(IcmaaCmsModule)
  registerModule(IcmaaFormsModule)
  registerModule(IcmaaTeaserModule)
  registerModule(IcmaaAdviceModule)
  registerModule(IcmaaMetaModule)
  registerModule(IcmaaGoogleTagManagerModule)
  registerModule(IcmaaRecommendationsModule)
  registerModule(IcmaaCompetitionsModule)
  registerModule(IcmaaSpotifyModule)
  registerModule(IcmaaProductAlertModule)
  registerModule(IcmaaGiftcertModule)
  registerModule(IcmaaTrackingModule)
  registerModule(IcmaaLooksModule)
  registerModule(IcmaaPayPalModule)
  registerModule(IcmaaLogsModule)
}

// Deprecated API, will be removed in 2.0
export const registerModules: VueStorefrontModule[] = [
]
