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
