# Runtime lifecycle implementation report

The implementation adds a container-local shutdown observer and bounded transport
drain, fixes CLI command shutdown ordering, and updates pipeline assembly, runtime
configuration, static delivery, and consumer documentation to follow the accepted
context contracts. The HTTP ingress limits in GitHub issue #4 remain a separate,
unresolved topic.

## Verification checklist

- [x] Runtime configuration, publication, reset, validation, and container isolation.
- [x] Handler ordering, duplicate and cross-stage rejection, and pipeline termination.
- [x] HTTP SSE cooperative and forced shutdown using real loopback sockets.
- [x] Real CLI Host: command stop precedes plugin shutdown with an active SSE response.
- [x] Cleartext HTTP/2 session with an uncooperative stream is forcibly closed.
- [x] Server start, stop, concurrent stop, cancellation, and bind failure.
- [x] Static file and HEAD delivery, missing target, and out-of-root symlink rejection.
- [x] Type checking, Markdown lint, and the unit and integration suites.
- [x] Secure HTTP/1.1 and HTTP/2 streams drain using real TLS connections and the
  test certificate fixture. Certificate authentication is disabled in this test;
  the test verifies transport shutdown, not certificate validation.
- [x] HTTP/2 admission during drain, retained native close failures, post-header
  stream failure and client disconnect, and zero timeout on HTTP/1, HTTP/2 and TLS.
- [x] Injected ENOENT, ENOTDIR, EACCES and EPERM pass through; overlapping
  requests retain isolated context and FINALIZE runs while responses remain open.
- [ ] The complete verification specifications include further combinations;
  these selected tests do not establish exhaustive acceptance coverage.

The context's verification specifications remain the complete acceptance checklist;
the checked items above record the evidence acquired in this implementation pass.

## Test refactoring and platform review

Unit tests now use explicit fakes for neighbouring production components. Checks
that combine runtime configuration components or real filesystem helpers run as
integration tests. New unit tests cover configuration state and lifecycle products,
retained close errors, admission during shutdown, and malformed static paths. Server
integration cases have independent test timeouts and cleanup hooks; the CLI readiness
poll also has its own deadline.

- `teqfw-platform .`: exit 0, `valid: true`, no violations. The selected source and
  unit-test extension is `.mjs`; there are no validator exclusions.
- `teqfw-esm-validator src`: exit 0, `valid: true`, no base-profile violations.
  The type-regular profile also passed for the changed regular components checked.
- `teqfw-esm-validator .`: exit 1, `valid: false`, with ten diagnostics. The TLS
  default-export alias is mapped to its `Data` contract; the validator expects the
  default wrapper. Three public structural aliases (`Pipeline_RequestContext`,
  `Response_Target`, and `Server_Instance`) use constructs outside the validator's
  structural grammar, producing two diagnostics each. Three existing `@throws`
  annotations use `Error`, which this package-root type-context check reports as
  unresolved. These results do not establish that changing public alias meanings is
  safe; the current aliases were retained.
- `teqfw-esm-validator src/Back/Config/Runtime.mjs --profile type-config-runtime`:
  exit 1; `runtime.freeze-lifecycle` and `runtime.wrapper-proxy` expect a local
  factory/proxy pattern. This package's accepted contract instead uses one shared,
  container-local transaction for runtime and TLS; the profile did not recognize it.
  This is an unresolved compatibility finding, not a passing validation.

The platform validator checks topology, not test semantics. The added HTTP/2 admission, stream-error, client disconnect, zero-timeout,
filesystem error and request-overlap checks are recorded above. The full verification
specifications still include additional combinations beyond the selected cases.

## Programmatic native transport options

The runtime factory now accepts `configureTransport({http, http2, https})` before
publication. The selected option set reaches the corresponding Node.js server;
other sets remain unused. First writes win per top-level field, the full option graph
is copied before mutation, and runtime/TLS/native options are committed and reset
together. Package-owned TLS credentials and protocol selection remain reserved.
The consumer reference describes the supported snapshot shapes and the limits of
native option validation.

Evidence acquired on Node.js v22.12.0 with `@teqfw/cli` 2.1.0, `@teqfw/di` 2.9.0
and `@teqfw/cfg` 2.0.0:

- Unit checks cover first-write precedence, all-or-nothing validation, TLS commit
  retry, reset, frozen facades, detached nested arrays/objects and Buffers, callback
  identity, reserved names, cycles, accessors and unsupported object instances.
- The real CLI Host initializes the factory in plugin startup and runs `web:start`;
  a configured header-size limit rejects an oversized request with 431 and both
  configured timeout values reach the native HTTP server.
- Real h2c and secure HTTP/2 clients observe independent `maxConcurrentStreams`
  settings; the secure server also serves an HTTP/1.1 request. Test certificate
  authentication is disabled for this transport test.
- A native HTTP server on the same Node.js version is used for default comparison;
  separate DI containers retain different settings; an invalid native value fails
  startup. Existing streaming shutdown tests are included in the integration run.

Node.js can silently ignore unknown option names. This mechanism does not assert
that every native option takes effect for every protocol or Node.js release. Callable
options retain application-owned identity and mutable closed-over state. The current
snapshot contract rejects object instances other than Buffers and plain containers;
applications requiring additional native object types need a separately specified
extension. The known package-root ESM type-map and runtime-profile findings recorded
above remain out of scope for this change. Package-root ESM validation also reports
two additional type-map diagnostics for the new native option type: its structural
grammar does not support `Omit` and Node.js `import()` types. TypeScript validates
the actual published Node.js option types; the alias remains to preserve them.

The evidence above was acquired against package revision
`30d2aa689e61275281ea8d464df3d1167f1f54de` and context revision
`dffb100e5614cc02eec03a3d66529d42f9c5f541`, plus the uncommitted changes for this
feature in both repositories. Commands: `npm run test:unit`,
`npm run test:integration`, `npm run typecheck`, `npm run lint:md`,
`teqfw-platform .`, `teqfw-esm-validator src`, and `adsm-ctx validate .`.
