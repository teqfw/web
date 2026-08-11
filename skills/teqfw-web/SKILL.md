---
name: teqfw-web
description: >
  Use this skill when integrating, configuring, testing, reviewing, or modifying
  TeqFW applications that use @teqfw/web request pipelines, handlers,
  Node.js server transport, runtime configuration, or static-file delivery.
---

# @teqfw/web

Use this skill for consumer code that composes or depends on the installed package.
Treat the host project's instructions, architecture, and test conventions as
authoritative.

## Apply

1. For a new integration, start with [Quick start](references/quick-start.md); use the
   specialized references below for the selected integration path.
2. Resolve web infrastructure through `TeqFw_Web_` DI tokens; application modules declare
   dependencies through `__deps__` and do not construct DI-managed services directly.
3. Register every handler before `lockHandlers()` or `server.start()`. The lifecycle is
   fixed as `INIT -> PROCESS -> FINALIZE` for the runtime instance.
4. In a `PROCESS` handler, end the response and set `context.completed = true`. Do not use
   removed `context.complete()` or `context.isCompleted()` helpers.
5. Configure runtime transport during bootstrap, including `@teqfw/cfg` loading when its
   `TEQFW_WEB` projection is used; treat frozen runtime configuration as read-only.
6. Read the selected references before editing and validate with the host project's tests.

## Select References

| Consumer task | Read |
| --- | --- |
| Start a new integration from installation to a working response | [Quick start](references/quick-start.md) |
| Understand package scope, DI boundary, or consumer entry points | [Concepts](references/concepts.md) |
| Add or change a custom handler, pipeline setup, or external transport adapter | [Pipeline and handlers](references/pipeline.md), [Usage](references/usage.md) |
| Start or configure the built-in Node.js server, HTTP/2, HTTPS, or TLS | [Server configuration](references/server.md), [Usage](references/usage.md) |
| Serve static files or review file-exposure rules | [Static files](references/static-files.md), [Pipeline and handlers](references/pipeline.md) |
| Configure package discovery, mount the skill, or verify distribution | [Distribution](references/distribution.md), [Concepts](references/concepts.md) |

This skill defines correct use of the installed package, not host-application routing,
domain behavior, deployment topology, or agent policy.
