# @teqfw/web

|CAUTION: TeqFW is an unstable, fast-growing project w/o backward compatibility. Use it at your own risk.|
|---|

This `teq`-plugin adds web server functionality to Tequila Framework based projects.

* console commands to start/stop this server in HTTP/1.1, HTTP/2, HTTPS modes;
* basic web requests processing with possibility to add various handlers;
* 4 handlers for base requests types:
    * to static resources;
    * to Web API services;
    * to upload files;
    * to process Server Sent Events;

## Install

```shell
$ npm i @teqfw/web --save 
```

## Namespace

This plugin uses `TeqFw_Web` namespace.

## CLI commands

These commands are in the `web`-plugin:

```shell
$ node ./bin/tequila.mjs help
Usage: tequila [options] [command]
...
Commands:
  web-server-start [options]  Start web server.
  web-server-stop             Stop web server.
```

## `./cfg/local.json`

[DTO](src/Back/Dto/Config/Local.mjs) for `/web/` node.

```json
{
  "@teqfw/web": {
    "server": {
      "port": 8080,
      "secure": {
        "cert": "/path/to/cert.pem",
        "key": "/path/to/key.pem"
      },
      "useHttp1": false
    },
    "urlBase": "domain.com"
  }
}
```

## `teqfw.json`

[DTO](src/Back/Dto/Plugin/Desc.mjs) for `@teqfw/web` nodes in `teq`-plugins descriptors.

```json
{
  "@teqfw/web": {
    "doors": ["admin", "pub"],
    "excludes": {
      "handlers": ["Ns_Mod"],
      "wapi": ["Ns_Mod"]
    },
    "handlers": {
      "Ns_Mod": {
        "after": ["Ns_Mod"],
        "before": ["Ns_Mod"],
        "spaces": ["custom"]
      }
    },
    "services": ["Ns_Mod"],
    "sse": ["Ns_Mod"],
    "statics": {
      "/url-path/": "/filesystem-path/"
    }
  }
}
```
