# Quick Start

This walkthrough shows the smallest consumer integration: one application `PROCESS`
handler, the built-in Node.js server, and a request returning `200 OK`.

## Prerequisites

- Node.js `>=20`.
- A host application with a TeqFW DI composition root.
- The host application's namespace metadata includes its own source tree and the
  published `TeqFw_Web_` namespace from `@teqfw/web`.

## Install and mount the skill

Install the package in the host application:

```sh
npm install @teqfw/web
```

Make the version-matched skill available to agents in the host project:

```sh
mkdir -p .agents/skills
ln -s ../../node_modules/@teqfw/web/skills/teqfw-web \
  .agents/skills/teqfw-web
```

## Add a handler

Create a `PROCESS` handler in the host application's source tree:

```js
// src/Handler/Hello.mjs
// @ts-check

export default class App_Web_Handler_Hello {
    constructor({dtoInfoFactory, STAGE}) {
        this.info = dtoInfoFactory.create({
            name: "App_Web_Handler_Hello",
            stage: STAGE.PROCESS,
        });
    }

    getRegistrationInfo() {
        return this.info;
    }

    async handle(context) {
        context.response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
        context.response.end("ok");
        context.completed = true;
    }
}

export const __deps__ = Object.freeze({
    dtoInfoFactory: "TeqFw_Web_Back_Dto_Info__Factory$",
    STAGE: "TeqFw_Web_Back_Enum_Stage$",
});
```

The handler ends the response before marking the request complete. Only `PROCESS`
handlers may set `context.completed = true`.

## Assemble and start the server

Create an application service that registers the handler before starting the server:

```js
// src/Server/Start.mjs
// @ts-check

export default class App_Web_Server_Start {
    constructor({pipeline, server, helloHandler}) {
        this.execute = async function () {
            pipeline.addHandler(helloHandler);
            await server.start({
                host: "127.0.0.1",
                port: 3000,
                type: "http",
            });
        };
    }
}

export const __deps__ = Object.freeze({
    pipeline: "TeqFw_Web_Back_PipelineEngine$",
    server: "TeqFw_Web_Back_Server$",
    helloHandler: "App_Web_Handler_Hello$",
});
```

The host composition root resolves `App_Web_Server_Start$` through the DI container
and calls `execute()`. It must register the host namespace before resolving the service;
use the public `NamespaceRegistry` entry point from `@teqfw/di/node/registry/namespace`.
Application modules do not construct the Pipeline Engine, Server, or handler with `new`.

## Verify the response

Start the host application's configured web command, then request the endpoint:

```sh
curl -i http://127.0.0.1:3000/
```

The response should be `200 OK` with the body `ok`.

## Next steps

- Read [Pipeline and handlers](pipeline.md) for ordering, locking, fallback outcomes,
  and lifecycle rules.
- Read [Server configuration](server.md) for HTTP/2, HTTPS, TLS, and runtime settings.
- Read [Static files](static-files.md) to add a static-file handler.
- Read [Usage](usage.md) for external transports and focused integration patterns.
