import { VueStorefrontModule } from '@vue-storefront/core/lib/module'
import { CatalogModule } from '@vue-storefront/core/modules/catalog'
import { CatalogNextModule } from '@vue-storefront/core/modules/catalog-next'
import { CartModule } from '@vue-storefront/core/modules/cart'
import { CheckoutModule } from '@vue-storefront/core/modules/checkout'
import { CompareModule } from '@vue-storefront/core/modules/compare'
import { WishlistModule } from '@vue-storefront/core/modules/wishlist'
import { NotificationModule } from '@vue-storefront/core/modules/notification'
import { UrlModule } from '@vue-storefront/core/modules/url'
import { BreadcrumbsModule } from '@vue-storefront/core/modules/breadcrumbs'
import { UserModule } from '@vue-storefront/core/modules/user'
import { CmsModule } from '@vue-storefront/core/modules/cms'
import { GoogleTagManagerModule } from './google-tag-manager';
import { AmpRendererModule } from './amp-renderer';
import { PaymentBackendMethodsModule } from './payment-backend-methods'
import { PaymentCashOnDeliveryModule } from './payment-cash-on-delivery'
import { NewsletterModule } from '@vue-storefront/core/modules/newsletter'
// ICMAA Modules
import { IcmaaExtendedConfigModule } from 'icmaa-config'
import { IcmaaExtendedUrlModule } from 'icmaa-url'
import { IcmaaExtendedCatalogModule } from 'icmaa-catalog'
import { IcmaaExtendedUserModule } from 'icmaa-user'
import { IcmaaExtendedNewsletterModule } from 'icmaa-newsletter'
import { IcmaaCategoryModule } from 'icmaa-category'
import { IcmaaCategoryExtrasModule } from 'icmaa-category-extras'
import { IcmaaCmsModule } from 'icmaa-cms'
import { IcmaaTeaserModule } from 'icmaa-teaser'
import { IcmaaAdviceModule } from 'icmaa-advice'
import { IcmaaMetaModule } from 'icmaa-meta'
import { IcmaaSpotifyModule } from 'icmaa-spotify'
import { IcmaaExternalCheckout } from 'icmaa-external-checkout'

import { registerModule } from '@vue-storefront/core/lib/modules'

// TODO:distributed across proper pages BEFORE 1.11
export function registerClientModules () {
  registerModule(UrlModule)
  registerModule(CatalogModule)
  registerModule(CheckoutModule) // To Checkout
  registerModule(CartModule)
  registerModule(PaymentBackendMethodsModule)
  registerModule(PaymentCashOnDeliveryModule)
  registerModule(WishlistModule) // Trigger on wishlist icon click
  registerModule(NotificationModule)
  registerModule(UserModule) // Trigger on user icon click
  registerModule(CatalogNextModule)
  registerModule(CompareModule)
  registerModule(BreadcrumbsModule)
  registerModule(GoogleTagManagerModule)
  registerModule(AmpRendererModule)
  registerModule(CmsModule)
  registerModule(NewsletterModule)
  // ICMAA Modules
  registerModule(IcmaaExtendedConfigModule)
  registerModule(IcmaaExtendedUrlModule)
  registerModule(IcmaaExtendedCatalogModule)
  registerModule(IcmaaExtendedUserModule)
  registerModule(IcmaaExtendedNewsletterModule)
  registerModule(IcmaaCmsModule)
  registerModule(IcmaaTeaserModule)
  registerModule(IcmaaAdviceModule)
  registerModule(IcmaaCategoryModule)
  registerModule(IcmaaCategoryExtrasModule)
  registerModule(IcmaaMetaModule)
  registerModule(IcmaaSpotifyModule)
  registerModule(IcmaaExternalCheckout)
}

// Deprecated API, will be removed in 2.0
export const registerModules: VueStorefrontModule[] = [
]
