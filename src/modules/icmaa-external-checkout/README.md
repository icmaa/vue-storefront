# `icmaa-external-checkout` module

Use our default magento checkout as bypass.
Based on: https://github.com/Vendic/vsf-external-checkout

**Because of the cookie-session handling, this module is only working when both systems, Magento and VSF, are running behind the same domain.**

## Session conflicts and logging out in both systems

There are some major caveats for bypassing the checkout. One of it is that you have to handle two session routines.

### Logout

**The Problem:** If you: login, add some products to cart, go to checkout, go back and logout in VSF. Then again add some products to cart without logging in and go to checkout again. Now you should still be logged in as the old user – not good.

As you logout in VSF the session in Magento will still be alive because Magento is not knowing that you have logged out.
This leads to conflicts if you start a new session and enter the checkout again as you will still be logged in as the user you've been before.

So, as Magento is saving it's session ID in a cookie, it has to be deleted on logout though. But Magento has an optional setting to set this cookie as a http-only cookie, which means it is not possible to delete it using client-side javascript. That is why we need to be able to make a server-side request which then deletes the cookie and disconnects your session in Magento too.

There are two options: `clearCookieOnLogout` to generally enable the cookie deletion on VSF logout and `httpOnlySupport` to make an server-side request to delete the cookie if you use http-only cookies in Magento.

For cookie handling we are using the `vue-cookies` and `cookies` node libraries.

# Config

```
{
  ...
  "externalCheckout": {
    "shopUrl": "https://www.domain-of-your-shop.com",
    "clearCookieOnLogout": true,
    "httpOnlySupport": true
  }
}
```

## Todo

[ ] ...
