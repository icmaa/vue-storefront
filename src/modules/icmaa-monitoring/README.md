# `icmaa-monitoring` module

Integrate monitoring and tracing using Datadog into VSF.

## Configs

* Add the following configs to your `config/local.json`:
  ```
  {
    "icmaa_monitoring": {
      "datadog": {
        "enabled": true,
        "clientToken": "XXX",
        "dataCenter": "eu"
      }
    }
  }
  ```

## Todo

[ ] Add health-check which checks for dropped exceptions and used services (mainly common API requests)
