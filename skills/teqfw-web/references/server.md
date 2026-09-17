# Server Configuration

## Built-In Server

`TeqFw_Web_Back_Server$` adapts Node.js `http` and `http2` transports to the Pipeline
Engine. `start(config)` locks the pipeline, creates the native server, binds request
events, and begins listening.

Supported `type` values from `TeqFw_Web_Back_Enum_Server_Type$` are:

- `http` — plain HTTP.
- `http2` — cleartext HTTP/2.
- `https` — secure `http2` server that may negotiate HTTP/2 or fall back to HTTP/1.1.

## Runtime Configuration

`TeqFw_Web_Back_Config_Runtime$` uses flat fields: `host`, `port`, `type`, and `tls`.
`host` is optional; when omitted, Node.js selects its default listen address. Set it
explicitly when the application requires a particular bind address.

TLS values are owned by `TeqFw_Web_Back_Config_Runtime_Tls$`. Secure `https` mode requires
both a key and certificate; `ca` is optional.

When application bootstrap loads `@teqfw/cfg`, do so before freezing the runtime
configuration factory. Its `TEQFW_WEB` namespace projects `HOST`, `PORT`, `TYPE`, and
`TLS` to the corresponding lower-case fields. Dotenv and process-environment sources
should use these flat keys:

```dotenv
TEQFW_WEB__HOST=127.0.0.1
TEQFW_WEB__PORT=3000
TEQFW_WEB__TYPE=https
TEQFW_WEB__TLS_CERT=/path/to/server-cert.pem
TEQFW_WEB__TLS_KEY=/path/to/server-key.pem
# Optional:
TEQFW_WEB__TLS_CA=/path/to/ca.pem
```

Typed cfg sources may provide `TEQFW_WEB__TLS` as an object with `ca`, `cert`, and
`key` fields. When both forms are present, the typed object wins per field and flat
`TLS_*` values fill only fields absent from that object. Explicit programmatic
`configure()` values take precedence over both cfg forms. A string or another
incompatible value in `TLS` is rejected with a configuration error; dotenv users
must use the flat keys above. Runtime configuration is startup-only and read-only
after freezing.
