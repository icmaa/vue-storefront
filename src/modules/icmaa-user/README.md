# `icmaa-user` module

* Extend the `user` module and add `customercluster` store.
* Add before-each router-guard to check for valid user in secure routes based on Vuex state
* Add Facebook login action to store and configs to `local.json`.
* Add functionallity for JWT expiration.
* Add methods to add demographic user-data to session and filter them in CLP

## Configs

You need to add the following config to the `config/local.json`:

```
  ...
  "icmaa": {
    "user: {
      "genderMap": {
        "male": "1129",
        ...
      },
      "genderProductMap": {
        "male": "9",
        ...
      },
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
* We uncommented the dispatch of the `user/startSession` action on the initialization of the user module. I'd liked to overwrite this asciton and if it isn't uncommented it would be called before my overwrite is applied. So I needed to uncomment it and call during the initialization of the `icmaa-user` module.  
  The reason I need to overwrite it is to call the `USER_START_SESSION` commit at the end of the function to be able to use a watcher on the `session_started` state property to know when the session is initialized inside a before-each router-guard. I could propably also use the event-bus but this wouldn't apply to the one-direction-data-flow of Vuex and might end-up in timing issues.

## Todo

[ ] ...
