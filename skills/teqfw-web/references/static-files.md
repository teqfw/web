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

When a static file is served successfully, the handler completes the request.

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
