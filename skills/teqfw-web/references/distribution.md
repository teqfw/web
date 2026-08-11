# Distribution

## Installed Location

The package publishes the version-matched skill at
`node_modules/@teqfw/web/skills/teqfw-web/`. Load `SKILL.md` as its entry point.
All selected references are below that directory and describe the installed package
version.

## Host-Owned Mounting

The host project decides whether and how to make the skill discoverable. Installation
performs no `postinstall` mutation and creates no links. A host using an `.agents/skills/`
catalog may mount it explicitly:

```sh
mkdir -p .agents/skills
ln -s ../../node_modules/@teqfw/web/skills/teqfw-web .agents/skills/teqfw-web
```

The host project's instructions and cognitive context remain authoritative for application
intent and architecture.
