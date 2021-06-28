# `icmaa-checkout-com` module

This module connects the VSF to a Magento1 Checkout.com implementation.

## Config

```
{
  ...
  "icmaa_checkoutcom": {
    "sandbox": false
  }
}
```

## Sandbox mode

To be able to use the same backend for different frontends during testing we have a sandbox mode which can be enabled using the `icmaa_checkoutcom.sandbox` config. If it is enabled, the current origin will be added to the additional-informations of the selected checkout.com payment and will be used as success- and failure-url inside Magento.  
It's important to also enable the sandbox-mode in the target Magento instance, otherwise the Magento base-url will be used.

## Todo

[ ] ...
