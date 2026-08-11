# Concepts

## Package Boundary

`@teqfw/web` is server-side request coordination infrastructure for TeqFW
applications. It provides a deterministic request pipeline and a Node.js server adapter.
It does not provide routing, controllers, domain models, persistence, sessions, or an
application architecture.

## Consumer Model

The package participates in TeqFW runtime composition through the `TeqFw_Web_` namespace.
Consumer modules declare the package values they need through `__deps__`; a composition
root resolves an application entry service through the DI container. Prefer public,
consumer-facing tokens such as:

- `TeqFw_Web_Back_PipelineEngine$` — lifecycle coordinator.
- `TeqFw_Web_Back_Server$` — built-in Node.js transport adapter.
- `TeqFw_Web_Back_Api_Handler` — custom-handler contract.
- `TeqFw_Web_Back_Dto_Info__Factory$` — handler registration metadata factory.
- `TeqFw_Web_Back_Dto_Source__Factory$` and `TeqFw_Web_Back_Handler_Static$` — static-file
  source and handler.

Use package tokens rather than deep implementation paths as the integration boundary.

## Runtime Shape

```text
Node.js transport -> Server -> Pipeline Engine -> ordered Handlers
```

An application may use the built-in Server or an external transport adapter that invokes a
locked Pipeline Engine. In both cases, Pipeline Engine remains the only request-lifecycle
coordinator.
