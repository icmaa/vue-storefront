# `icmaa-external-checkout` module

Use a remote checkout, e.g. your default magento checkout as bypass.

Based on: https://github.com/Vendic/vsf-external-checkout

## Session conflicts and logging out in both systems

...

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
