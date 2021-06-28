# `icmaa-checkout` module

This module is a copy of the original `checkout` module extended by our functionality.

# Config

```
{
  "icmaa_checkout": {
    "endpoint": "/api/icmaa-checkout",
    "endpoints": {
      "quote": "/quote?token={{token}}&cartId={{cartId}}",
      "shippingMethods": "/shipping-methods?token={{token}}&cartId={{cartId}}",
      "order": "/order?token={{token}}&cartId={{cartId}}"
    },
    "agreements": {
      "countryAllowlist": [ "de", "at", "ch", "en", "uk", "us", "fr" ]
    }
  },
  ...
}
```

## Todo

[ ] ...
