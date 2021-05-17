# `icmaa-logs` module

Transfer browser logs to logging backend, eg. Datadog.

## Configs

* ...

## Enable GoogleCloud Operations libs

To have proper metrics inside the GoogleCloud we need to include some libraries at the beginning of the server initialization.
You have to include the following line at the very beginning of the `core/scripts/server.ts` file:
```ts
import 'icmaa-logs/lib/gcloud'
```

This file is initializing the necessary libraries on import to enable profiling, tracing and debugging (WIP).

## Todo

[ ] ...
