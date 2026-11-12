# Static Files

`TeqFw_Web_Back_Handler_Static$` is a PROCESS-stage handler. Initialize it with source DTOs
created by `TeqFw_Web_Back_Dto_Source__Factory$`, then register it before the pipeline is
locked.

Each source defines:

- `root` — filesystem root.
- `prefix` — matching URL prefix.
- `allow` — optional allowlist map for paths under `root`.
- `defaults` — optional fallback filenames for directory requests.

Path traversal and absolute-path escapes are blocked. Omitting `allow` does not enable
directory listings; it allows resolvable paths under `root`, subject to traversal and file
existence checks. Prefer an explicit allowlist for generated application configuration.

```js
const source = dtoSourceFactory.create({
    root: "./web",
    prefix: "/",
    allow: {
        ".": ["assets", "favicon.ico", "robots.txt"],
    },
    defaults: ["index.html"],
});

await staticHandler.init({sources: [source]});
pipeline.addHandler(staticHandler);
```

The handler serves GET and HEAD; other methods pass through. HEAD sends headers without a body. Malformed URL encoding produces 400. The current behavior and intended contract distinguish these cases:

- A path excluded by `allow` is not published by this handler and passes through to later handlers. Traversal, a canonical target outside the root, and non-file targets also pass through.
- A missing path (`ENOENT` or `ENOTDIR`), including a missing default file, passes through; later handlers decide the response.
- Filesystem permission errors (`EACCES` or `EPERM`) are handled failures, not missing files: before headers, the handler returns a sanitized 500 (without a body for HEAD), logs a warning with the request ID when available, and marks processing complete. If a response has started, it is destroyed instead of sending a second response. Other unexpected filesystem errors use the same response boundary and are logged as errors. Stream errors after headers destroy the response.

Symlinks are served only when their canonical targets remain under the canonical root. The source directory must be trusted against concurrent replacement. When the handler accepts delivery, it marks processing complete without waiting for the transfer to finish.

## Source registration

Each `init` normalizes source prefixes by appending a trailing slash if absent: `/foo` and
`/foo/` therefore conflict. A duplicate normalized prefix within a call or against a prior
registration rejects the call with an error. Invalid or conflicting batches are atomic: no
source in the batch is registered and previous sources remain unchanged. Distinct prefixes
are matched longest first.

## MIME Types

Static responses use `TeqFw_Web_Back_Helper_Mime$` to select the `Content-Type`
from the file extension. The helper includes common web and document types,
including Markdown, source maps, WebAssembly, modern image/audio/video formats,
RSS/Atom feeds, and YAML.

Add application-specific types to the DI-managed helper during application bootstrap:

```js
const mime = await container.get("TeqFw_Web_Back_Helper_Mime$");
mime.addTypes({
    report: "application/vnd.example.report",
    ".custom": "text/x-custom; charset=utf-8",
    ".legacy": "application/x-legacy-format",
});

mime.overrideTypes({
    ".json": "application/ld+json",
});

mime.getByExt(".REPORT"); // application/vnd.example.report
mime.getByExt(".html"); // text/html; charset=utf-8
mime.getByExt(".json"); // application/ld+json
```

`getByExt()` returns the complete HTTP `Content-Type` value. Built-in `text/*`
types receive `charset=utf-8` by default; an existing charset is preserved and
binary or non-`text/*` types receive no charset automatically.

`addTypes()` validates and copies each map into the helper instance. Custom keys
are trimmed, normalized to lower case, and stored with a leading dot. Lookup is
case-insensitive and accepts extensions with or without the dot. Custom values
may include valid Content-Type parameters, including an explicit charset.

`overrideTypes()` is the explicit escape hatch for replacing a built-in value.
It accepts only extensions already present in the built-in table, so it cannot
silently add an unknown extension. Both maps are instance-local and have this
precedence: `overrideTypes()` > built-in > `addTypes()` >
`application/octet-stream`. Invalid maps throw `TypeError`.
