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
