# `icmaa-user` module

* Extend the `user` module and add `customercluster` store.
* Add Facebook login action to store and configs to `local.json`.
* Add functionallity for JWT expiration.
* Add methods to add demographic user-data to session and filter them in CLP

## Configs

You need to add the following config to the `config/local.json`:

```
  ...
  "icmaa": {
    "user: {
      "noClusterValue": "4352",  # The attribute-value for "No cluster"
      "clpSessionFilters": [ "gender" ] # The attributes that are stored in the customer-session that should be filtered in CLP
    }
  }
  "icmaa_facebook": {
    "endpoint": "/api/ext/icmaa-facebook",
    "login": {
      "enabled": true,
      "appId": "XXXXXXXXXXXXXXX",
      "version": "v5.0",
      "scope": "email,user_birthday,user_gender"
    }
  },
  ...
```

## Core changes

We try to overwrite everything needed by extending the Vuex store. But some methods are not highjackable like that – this is a list of core changes.

* We added an `await` to the `cart/authorize` action inside the `restoreCurrentUserFromCache` action in `core/modules/user/store/actions.ts` to be sure to wait for a valid cart.

## Todo

[ ] ...
