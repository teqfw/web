# Changelog

## [2.0.0] - 2026-08-11 - Agent-built TeqFW v2 web runtime

This is the first `@teqfw/web` release implemented by an agent under human
architectural direction and acceptance.

### Added

- Rebuilt the package as the TeqFW v2 web runtime with a Node.js transport,
  ordered handler pipeline, and the `INIT -> PROCESS -> FINALIZE` lifecycle.
- Added runtime configuration for HTTP, HTTP/2, and HTTPS; static-file delivery;
  request logging; response helpers; and the `web:start` CLI command.
- Added unit and integration coverage, JSDoc type checking, public type aliases,
  and the version-matched `skills/teqfw-web/` consumer Agent Skill.
- Added package-local project skills, including project conventions and links to
  installed TeqFW dependency skills.

### Changed

- Migrated package metadata and DI registration to the TeqFW v2 `fw.di` and
  `fw.cli` descriptors, with Node.js `>=20` as the supported runtime.
- Replaced the previous web-server plugin model with the current server,
  pipeline, handler, and runtime-configuration contracts.
- Reworked the README as the human-facing overview and kept detailed integration
  guidance in the published consumer skill.

### Removed

- Removed the legacy `teqfw.json` descriptor, old CLI start/stop commands,
  browser-side modules, and obsolete runtime implementation.
- Removed the unpublished `ai/` documentation surface and legacy release
  scripts.

### Compatibility

- This is a major release. Consumers must migrate to the TeqFW v2 DI,
  configuration, logging, and CLI dependencies and use the `TeqFw_Web_`
  namespace declaration.
- Migrate custom handlers to the `context.completed` completion contract and
  mount `skills/teqfw-web/` instead of the removed `ai/` directory.

## [0.16.0] - 2026-08-06 - CLI startup and published agent interface

### Added

- CLI command `web:start` for starting the web server through `@teqfw/cli` host.
- Published consumer Agent Skill at `skills/teqfw-web/` with package concepts, lifecycle, configuration, static-file, and integration guidance.
- Configuration integration through `@teqfw/cfg` and canonical namespace discovery through `@teqfw/di`.
- Strict JSDoc typechecking and Markdown linting for the package and its tests.

### Changed

- Moved the package metadata to the current TeqFW `fw.di` and `fw.cli` descriptor structure.
- Updated the public type map and runtime contracts for the current TeqFW DI, configuration, logging, and CLI dependencies.
- Added the `start` package script and aligned runtime configuration loading with the `TEQFW_WEB` configuration namespace.
- Replaced the unpublished `ai/` documentation surface with the published version-matched `skills/` surface.

### Removed

- Removed the obsolete root npm publication workflow; release publication is handled by the current release process.

### Compatibility

- Consumers using the published package must provide the TeqFW DI, configuration, and CLI components required by the new runtime assembly contract.
- Agent integrations must mount `skills/teqfw-web/` instead of the removed `ai/` directory.

## [0.15.0] - 2026-07-14 - Listening host and TeqFW ESM conformance

### Added

- Added optional flat runtime field `host` for selecting the native server bind address.
- Added unit and integration coverage for forwarding and applying an explicit listening host.

### Changed

- Renamed non-runtime default-exported classes to their final namespace segments while preserving full `@namespace` annotations and DI identifiers.
- Reused the TLS runtime `Data` shape as the `configure()` input contract.
- Updated human-facing and AI-facing usage documentation with explicit loopback-binding guidance.
- Synchronized cognitive-context filesystem facts, listening-endpoint terminology, module naming rules, and architecture constraints.
- Stopped tracking `package-lock.json` for this library and changed release jobs to install dependencies from package metadata.
- Updated package version metadata to `0.15.0`.

### Removed

- Removed the redundant `TeqFw_Web_Back_Config_Runtime_Tls.Params` export and `TeqFw_Web_Back_Config_Runtime_Tls__Params` type alias.

### Compatibility

- Omitting `host` preserves the previous Node.js default listen-address selection.
- Default imports and DI identifiers are unchanged. Code that inspects default class `name` values or references the removed TLS `Params` type must migrate to the short class name or `TeqFw_Web_Back_Config_Runtime_Tls__Data` respectively.

## [0.14.0] - 2026-07-12 - Completion contract simplification and agent interface hardening

### Added

- Added `ai/recipes.md` with canonical agent-oriented patterns for custom handlers, static handler setup, and external transport adapters.

### Changed

- Simplified request completion semantics to rely on `context.completed = true` as the stable handler-facing contract.
- Realigned `README.md`, `ai/`, tests, and code-level context documentation with the preferred class-based handler shape and explicit static-source configuration guidance.
- Strengthened AI-facing static handler documentation with explicit `allow` semantics and configuration examples.
- Updated package version metadata to `0.14.0`.

### Removed

- Removed runtime helper methods `context.complete()` and `context.isCompleted()` from `TeqFw_Web_Back_PipelineEngine` request contexts.

### Compatibility

- Existing custom handlers that still call `context.complete()` or read `context.isCompleted()` will break and must be migrated to the `completed` flag contract.

## [0.13.0] - 2026-07-10 - TeqFW logging migration and package surface alignment

### Added

- Added `jsconfig.json` to the published npm package surface.
- Added class-and-instance public type aliases in `types.d.ts` following the TeqFW `$` instance convention.

### Changed

- Migrated runtime logging from the local logger facade to `@teqfw/log` with source-bound logger usage.
- Removed the direct `@teqfw/di` package dependency and relied on the platform component graph through `@teqfw/log`.
- Aligned README, `ai/`, tests, and code-level context documentation with the current logging and typing contracts.
- Removed the unused ESLint config from the package root.
- Updated package version metadata to `0.13.0`.

## [0.12.0] - 2026-07-04 - Pipeline locking and transport contract alignment

### Added

- Added unit and integration coverage for direct request execution with an unlocked pipeline.
- Added unit coverage for the request-context DTO contract.

### Changed

- Stopped pipeline processing when the response is no longer writable.
- Required explicit handler locking before direct `PipelineEngine` request execution.
- Clarified the transport model as plain HTTP plus secure web transport and aligned AI-facing documentation with the current server behavior.
- Clarified that runtime-isolation guarantees apply to separate Node.js processes, not to multiple containers within one process.
- Updated package version metadata to `0.12.0`.

## [0.11.0] - 2026-04-01 - TeqFW spec alignment and runtime contract updates

### Added

- Added TeqFW specification documents for DI usage, ES module conventions, and package metadata expectations.

### Changed

- Reworked runtime configuration docs and examples to follow the current spec-level contract.
- Tightened runtime configuration implementation and unit tests to match the updated contract.
- Replaced legacy TeqFW convention documents with the current spec-oriented documentation layout.
- Updated package version metadata to `0.11.0`.

## [0.10.0] - 2026-03-31 - Validator conformance and release preparation

### Changed

- Updated handler interfaces and runtime DTOs to conform to validator requirements.
- Removed the ESLint development dependency after aligning the codebase with the current validation approach.
- Updated package version metadata to `0.10.0`.

## [0.9.0] - 2026-03-25 - Release preparation for minor version bump

### Changed

- Updated package version metadata to `0.9.0`.

## [0.8.0] - 2026-03-17 - Flat runtime configuration and server startup alignment

### Changed

- Flattened runtime startup configuration to top-level fields `port`, `type`, and `tls` (without nested `server` branch).
- Aligned server startup and runtime components with the updated flat runtime configuration contract.
- Updated and verified the `ai/` consumer interface documentation to reflect current runtime usage patterns.
- Updated package version metadata to `0.8.0`.

## [0.7.0] - 2026-03-16 - Runtime composition and agent interface alignment

### Changed

- Refined runtime configuration composition for server and TLS branches and preserved immutable runtime state semantics.
- Updated and verified the `ai/` consumer interface documentation against the current package behavior and usage rules.
- Updated package version metadata to `0.7.0`.

## [0.6.0] - 2026-03-16 - Runtime configuration hardening

### Added

- Added JSDoc coverage for request-context DTO usage and runtime configuration components.

### Changed

- Refined runtime configuration composition for server and TLS settings.
- Hardened runtime configuration objects to remain immutable after initialization.
- Updated package version metadata to `0.6.0`.

## [0.5.0] - 2026-03-13

### Added

- Added `ai/` documentation for agent-oriented project materials.
- Added a non-resettable request-context attribute.
- Added component type conventions to the cognitive context.

### Changed

- Updated `README.md` with package and agent-interface documentation refinements.
- Migrated dependency injection to `@teqfw/di` v2 and updated package metadata accordingly.
- Refined architecture and terminology around the dispatcher, request context, and transport boundary.
- Reworked source files to codex-generated module layout and aligned exported namespace style with the `$` convention.
- Verified modules in `src/` against updated TeqFW ES module conventions and aligned DTO component types with those rules.
- Restructured and cleaned up `ctx/docs`, including TeqFW convention documents and removal of the obsolete composition level.
- Moved the accept test into the integration test suite.
- Refreshed runtime and development dependencies.

### Removed

- Removed legacy code, tests, and the shared `common.mjs` unit-test helper.

## [0.4.0] - 2025-12-20

### Added

- TypeScript type declarations for the public API via `types.d.ts`.
- ADSM cognitive context in `ctx/`.

## [0.3.1] - 2025-08-21

### Added

- Added TeqFW descriptor to define package namespace for @teqfw/core.

## [0.3.0] - 2025-06-26

### Added

- Generalized NPM handler into a Source handler with DTO-based configuration.
- Unit tests for the dispatcher and built-in handlers.

### Changed

- Static handler refactored into modular components with before/after ordering.

### Fixed

- Improved validation messages for static handler configuration.
- File service now reports specific filesystem errors.

## [0.2.0] - 2025-06-21

### Added

- Integration test covering static file serving from `node_modules`.
- Static handler can serve files from `node_modules` via `Handler_Source`.
- JSDoc examples for initializing the static handler with a `Handler_Source` DTO.

## [0.1.0] - 2025-06-11

### Added

- Initial release of `@teqfw/web`, a TeqFW plugin for centralized HTTP(S) request handling.
- Dispatcher with three-stage lifecycle: `pre`, `process`, and `post`, each with isolated execution logic.
- Middleware registration with support for execution order via `before`/`after` dependencies.
- Support for custom adapters to integrate with various web servers (e.g., Express, Fastify, Node.js `http`).
- Basic Node.js HTTP server implementation for standalone use cases.
- Unified interfaces for registering request handlers from other teq-plugins.
- Modular architecture compatible with Tequila Framework philosophy.
