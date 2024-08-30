# @teqfw/web

## Disclaimer

This package is a part of the [Tequila Framework](https://flancer32.com/what-is-teqfw-f84ab4c66abf) (TeqFW). The TeqFW
is currently in an early stage of development and should be considered unstable. It may change rapidly, leading to
breaking changes without prior notice. Use it at your own risk. Please note that contributions to the project are
welcome, but they should only be made by those who understand and accept the risks of working with an unstable
framework.

## Overview

This `teq`-plugin adds basic web server functionality to Tequila Framework based projects.

* console commands to start/stop web server in HTTP/1.1, HTTP/2, HTTPS modes;
* basic web requests processing with possibility to add various handlers;
* requests handlers:
    * `TeqFw_Web_Back_App_Server_Handler_Final`: unprocessed requests responder;
    * `TeqFw_Web_Back_App_Server_Handler_Static`: GET requests for static resources;
    * `TeqFw_Web_Back_App_Server_Handler_Config`: GET requests to load various frontend configurations;

## TODO

* move the IndexedDB functionality to some external plugin (@teqfw/front-idb?)

### Namespace

This plugin uses `TeqFw_Web` namespace.

## Install

```shell
$ npm i @teqfw/web --save 
```

## Namespace

This plugin uses `TeqFw_Web` namespace.

## CLI commands

```shell
$ node ./bin/tequila.mjs help
Usage: tequila [options] [command]
...
Commands:
  web-server-start [options]  Start web server.
  web-server-stop             Stop web server.
```

```shell
$ node ./bin/tequila.mjs help web-server-start
... 
Options:
  -c, --cert <path>  certificates chain in PEM format to secure HTTP/2 server
  -1, --http1        use HTTP/1 server (default: HTTP/2)
  -k, --key <path>   private key in PEM format to secure HTTP/2 server
  -p, --port <port>  port to use (default: 8080)
  -s, --skipPid      don't save PID file (used for read-only filesystems like Google AppEngine)
  -w, --useWs        use web sockets with this server
  -h, --help         display help for command

```

## `./cfg/local.json`

[DTO](src/Back/Plugin/Dto/Config/Local.mjs) for `@teqfw/web` node.

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

[DTO](src/Back/Plugin/Dto/Desc.mjs) for `@teqfw/web` nodes in `teq`-plugins descriptors.

```json
{
  "@teqfw/web": {
    "doors": ["admin", "pub"],
    "excludes": {
      "handlers": ["Ns_Mod"]
    },
    "handlers": {
      "Ns_Mod": {
        "after": ["Ns_Mod"],
        "before": ["Ns_Mod"],
        "spaces": ["custom"]
      }
    },
    "statics": {
      "/url-path/": "/filesystem-path/"
    }
  }
}
```
