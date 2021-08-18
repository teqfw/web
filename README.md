# @teqfw/web

This package adds web functionality to Tequila Framework based projects.

* web server (HTTP/1) and console commands to start/stop this server;
* static handler to process HTTP requests to static resources;
* service handler to process HTTP requests to API services;

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
  web-server-start [options]  Start the HTTP/1 server.
  web-server-stop             Stop the HTTP/1 server.
```

## `./cfg/local.json`

[DTO](src/Back/Api/Dto/Config/Local.mjs) for `/web/` node.

```json
{
  "@teqfw/web": {
    "server": {"port": 3000},
    "urlBase": "domain.com"
  }
}
```

## `teqfw.json`

[DTO](./src/Back/Api/Dto/Plugin/Desc.mjs) for `/web/` node.

```json
{
  "@teqfw/web": {
    "doors": ["admin", "pub"],
    "handlers": [
      {
        "factoryId": "Vnd_Prj_Plugin_Web_Handler_Name",
        "before": "TeqFw_Web_Back_Plugin_Web_Handler_Static",
        "spaces": ["custom"],
        "weight": 1000
      }
    ],
    "root": "demo",
    "statics": {
      "/vue-router/": "/vue-router/dist/",
      "/vue/": "/vue/dist/"
    }
  }
}
```
