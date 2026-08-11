# @teqfw/web

![npms.io](https://img.shields.io/npm/dm/@teqfw/web)

> **Human-governed. Agent-built. Agent-ready.**

`@teqfw/web` coordinates deterministic web request processing through a built-in Node.js server and ordered handler pipeline. It is part of the Tequila Framework ([TeqFW](https://teqfw.com/)): created and evolved by coding agents under the architectural direction and final responsibility of [Alex Gusev](https://github.com/flancer64), and shipped with a version-matched Agent Skill so other agents can understand, integrate, and use it correctly.

## Why use it

The package gives independently developed TeqFW packages one predictable request lifecycle while leaving runtime assembly under application control. It provides:

- a unified server boundary for `http`, `http2`, and `https`;
- deterministic handler ordering from declarative `before`/`after` metadata;
- the fixed `INIT -> PROCESS -> FINALIZE` request lifecycle;
- request completion and safe `404 Not Found` / `500 Internal Server Error` fallbacks;
- optional static-file delivery and a CLI command for starting the server.

It is an orchestration layer, not a routing or controller framework. Routing, business logic, persistence, sessions, authentication, and application architecture remain outside the package.

## Request lifecycle

Each request passes through three stages:

```text
INIT -> PROCESS -> FINALIZE
```

Handlers are registered before the runtime starts. The Pipeline Engine derives their effective order from registration metadata and coordinates execution. A `PROCESS` handler completes a request by ending the response and setting `context.completed = true`; `FINALIZE` still runs afterward.

## Quick Start

Install the package in a TeqFW application:

```sh
npm install @teqfw/web
```

Register the package namespace with the host application's TeqFW DI container, add application handlers before server start, and configure the transport:

```javascript
pipeline.addHandler(helloHandler);

await server.start({
  host: "127.0.0.1",
  port: 3000,
  type: "http",
});
```

The package requires Node.js `>=20` and a configured TeqFW DI container. See the Agent Skill for the complete composition and configuration contract.

## Agent Skill

The package distributes a version-matched consumer skill at [`skills/teqfw-web/`](skills/teqfw-web/). Its `SKILL.md` and references cover lifecycle semantics, handlers, server configuration, static files, distribution, and TeqFW integration.

## Agent-Driven Development

TeqFW is built through the same development model that it is designed to enable: one human defines the intent, architecture, constraints, and acceptance criteria; coding agents implement and maintain the products; other agents use those products in different combinations to create applications.

`@teqfw/web` is part of TeqFW and provides its web runtime orchestration layer. The package includes a version-matched Agent Skill in `skills/teqfw-web/`. The README provides a human-facing product overview; the skill provides agents with the package concepts, contracts, integration rules, examples, and boundaries.

Mount the skill into a host project:

```sh
mkdir -p .agents/skills
ln -s ../../node_modules/@teqfw/web/skills/teqfw-web \
  .agents/skills/teqfw-web
```

Each TeqFW package is both a practical software component and a working demonstration of human-governed, agent-driven development. This work follows the Agent-Driven Software Management (ADSM) approach: human intent, architectural authority, acceptance, and responsibility remain authoritative; agents act as implementation and reasoning partners.

- [Tequila Framework](https://teqfw.com/?from=github-flancer32-teq-web)
- [Agent-Driven Software Management: A Practical Guide](http://fly.wiredgeese.com/flancer/leanpub/adsm-en/?from=github-flancer32-teq-web)
- [Alex Gusev](https://github.com/flancer64)

## License

Apache-2.0
