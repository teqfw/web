# Server Configuration

## Built-In Server

`TeqFw_Web_Back_Server$` adapts Node.js `http` and `http2` transports to the Pipeline
Engine. `start(config)` locks the pipeline, creates the native server, binds request
events, and resolves after listening. One start attempt is supported; restart is not supported.

Supported `type` values from `TeqFw_Web_Back_Enum_Server_Type$` are:

- `http` — plain HTTP.
- `http2` — cleartext HTTP/2.
- `https` — secure `http2` server that may negotiate HTTP/2 or fall back to HTTP/1.1.

## Runtime Configuration

`TeqFw_Web_Back_Config_Runtime$` exposes `host`, `port`, `type`, `tls`, and
`shutdownTimeout`. Defaults are `127.0.0.1`, `3000`, `http`, and 5000 milliseconds.
Port 0 asks the OS for an available port; `shutdownTimeout` may be 0 through
2147483647 milliseconds.

TLS values are owned by `TeqFw_Web_Back_Config_Runtime_Tls$`. Secure `https` mode requires
both a key and certificate; `ca` is optional.

When application bootstrap loads `@teqfw/cfg`, do so before freezing the runtime
configuration factory. Its `TEQFW_WEB` namespace projects `HOST`, `PORT`, `TYPE`, and
`TLS`, and `SHUTDOWN_TIMEOUT` to the corresponding lower-case fields. Dotenv and process-environment sources
should use these flat keys:

```dotenv
TEQFW_WEB__HOST=127.0.0.1
TEQFW_WEB__PORT=3000
TEQFW_WEB__TYPE=https
TEQFW_WEB__SHUTDOWN_TIMEOUT=5000
# TLS_CERT and TLS_KEY must contain PEM material, not filesystem paths.
# Optional:
# TEQFW_WEB__TLS_CA may contain optional PEM material.
```

Typed cfg sources may provide `TEQFW_WEB__TLS` as an object with `ca`, `cert`, and
`key` fields. When both forms are present, the typed object wins per field and flat
`TLS_*` values fill only fields absent from that object. Explicit programmatic
`configure()` values take precedence over both cfg forms. A string or another
incompatible value in `TLS` is rejected with a configuration error; dotenv users
must use the flat keys above. Runtime configuration is startup-only and read-only
after freezing.

## Stream shutdown

Inject `TeqFw_Web_Back_ServerLifecycle$` into stream owners and observe its
read-only `shutdownSignal`. The server stops admission before aborting the signal,
then waits for connections to close until the configured timeout and forcibly closes
remaining connections and HTTP/2 sessions. Listener promises are not awaited. A
listener must handle a signal that is already aborted and unsubscribe on response
closure. For example, after opening an SSE response:

```js
const signal = lifecycle.shutdownSignal;
const finish = () => response.end();
response.once("close", () => signal.removeEventListener("abort", finish));
if (signal.aborted) finish();
else signal.addEventListener("abort", finish, {once: true});
context.completed = true;
```

Configure before startup with `runtimeFactory.configure({shutdownTimeout: 5000})`
or `TEQFW_WEB__SHUTDOWN_TIMEOUT`. `reset()` clears the complete programmatic
runtime and TLS draft before publication; `freeze()` commits both atomically.
