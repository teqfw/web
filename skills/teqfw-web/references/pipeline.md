# Pipeline And Handlers

## Lifecycle

The Pipeline Engine executes handlers in the fixed order:

```text
INIT -> PROCESS -> FINALIZE
```

Register handlers during setup with `addHandler()` or `registerHandler()`, then call
`lockHandlers()` before direct request execution. `server.start()` locks the pipeline for
the built-in transport. Registration and effective handler order are immutable afterwards.

Handler metadata is created through `TeqFw_Web_Back_Dto_Info__Factory$` and includes a
unique `name`, `stage`, plus stage-local `before` and `after` ordering constraints.

## Handler Contract

A custom handler implements:

- `getRegistrationInfo()` — returns stable registration metadata.
- `handle(context)` — processes one request.

The request context exposes `request`, `response`, mutable request-scoped `data`, and the
monotonic `completed` flag. Do not replace the context object.

Only `PROCESS` handlers may set `context.completed = true`. Completion stops later normal
PROCESS handlers, while FINALIZE handlers still run. INIT and FINALIZE handlers must never
complete a request.

If no PROCESS handler completes a writable response, the pipeline sends `404 Not Found`.
If a PROCESS handler throws while the response is writable, it sends `500 Internal Server
Error` and stops further PROCESS handlers. INIT and FINALIZE exceptions are isolated.
