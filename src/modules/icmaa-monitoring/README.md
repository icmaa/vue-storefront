# `icmaa-monitoring` module

Integrate a health-check and monitoring providers into VSF.

## Configs

* Add the following configs to your `config/local.json`:
  ```
  {
    "icmaa_monitoring": {
      "datadog": {
        "enabled": true
      }
    }
  }
  ```

## Todo

[ ] Add health-check which checks for dropped exceptions and used services (mainly common API requests)
[ ] Add client-side tracing and exceptions handling
