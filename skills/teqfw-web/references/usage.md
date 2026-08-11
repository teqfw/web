# Usage

## Custom PROCESS Handler

```js
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

## Built-In Server

Register handlers in a DI-managed application service and start the server afterwards:

```js
this.pipeline.addHandler(this.helloHandler);
await this.server.start({host: "127.0.0.1", port: 3000, type: "http"});
```

The composition root resolves that application service with the DI container. Application
modules do not create DI-managed handlers, Pipeline Engine, or Server with `new`.

## External Transport

Use this only when another transport layer owns request ingress:

```js
await pipeline.lockHandlers();

transport.on("request", async (req, res) => {
    await pipeline.onEventRequest(req, res);
});
```

Register all handlers before locking. Pass writable native request and response objects.
