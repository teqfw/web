# @teqfw/web

|CAUTION: TeqFW is an unstable project w/o backward compatibility. Use it at your own risk.|
|---|

This `teq`-plugin adds basic web server functionality to Tequila Framework based projects.

* console commands to start/stop web server in HTTP/1.1, HTTP/2, HTTPS modes;
* basic web requests processing with possibility to add various handlers;
* requests handlers:
    * `TeqFw_Web_Back_App_Server_Handler_Final`: unprocessed requests responder;
    * `TeqFw_Web_Back_App_Server_Handler_Static`: GET requests for static resources;
    * `TeqFw_Web_Back_App_Server_Handler_Config`: GET requests to load various frontend configurations;

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
      "handlers": ["Ns_Mod"],
      "swCache": ["./img/exrc/"]
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
