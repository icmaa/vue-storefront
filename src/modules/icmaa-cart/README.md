# `icmaa-cart` module

Add our custom functionality for the original `cart` module:
* Overwrites the `cart/getCoupon` store getter to evaluate if a `ugiftcert` (Unirgy-GiftCert) is applied to cart.
* Add functionallity for JWT expiration.

## Core changes

We try to overwrite everything needed by extending the Vuex store. But some methods are not highjackable like that – this is a list of core changes.

* In the `core/modules/cart/store/actions/synchronizeActions.ts` we added some `async`/`await` logic to be sure to wait for specific requests. We added one for the `cart/synchronizeCart` action inside the `cart/load` action. We also prevent `cart/create` inside the `cart/synchronizeCart` action if a token is already found (just `cart/sync` instead).

## Todo

[ ] ...
