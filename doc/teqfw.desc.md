# TeqFW descriptor's options

## @teqfw/web

`@teqfw/web` plugin can parse these options of `./teqfw.json` descriptors of teq-plugins:

```json
{
  "@teqfw/web": {
    "doors": ["admin", "pub"],
    "handlers": {
      "Vnd_Prj_Back_Plugin_Web_Handler_Name_Second": {
        "after": ["Vnd_Prj_Back_Plugin_Web_Handler_Name_First"],
        "before": ["Vnd_Prj_Back_Plugin_Web_Handler_Name_Third"],
        "spaces": ["space1", "space2"],
        "weight": 10
      }
    },
    "services": [
      "Vnd_Prj_Back_WAPI_Name"
    ],
    "statics": {
      "/package/": "/package/dist/"
    }
  }
}
```

## `doors`

List of available `doors` in an application (https://domain.com/[root]/[door]/[space]/...). Each `door` has own cookies
and service workers on the front (in the browser). This is application level option.

## `handlers`

List of a handlers to process requests to web-server.

* `key`: DI-identifier of the handler;
* `after`: DI-identifiers of the handlers after which this handler will run (TODO);
* `before`: DI-identifiers of the handlers before which this handler will run (TODO);
* `spaces`: spaces that will process by this handler;
* `weight`: weight of the handler in the list of all handlers (more weight means closer to the beginning of the list).
  This is temporary approach for quick organizing of the requests handlers. before/after options are more flexible but
  is more complex.

## `services`

List of plugin's services that are processed by `TeqFw_Web_Back_Plugin_Web_Handler_Service` handler.

## `statics`

Static resources map for npm-packages that are not a teq-plugins (w/o `./teqfw.json` descriptor). This is application
level option.
