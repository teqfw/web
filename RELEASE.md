# @teqfw/web: Releases

## 0.24.2

* Enable console logging on startup.

## 0.24.1

* Remove the legacy format for depIds.

## 0.24.0

* Create a secured server from `node:https` (was: `node:http2`).

## 0.23.0

* The new format of the cast utils.
* The improvement of the `web/js/bootstrap.mjs`.
* The `web/js/loaders.mjs` ia added.

## 0.22.0

* The sources archive functionality is extracted to `@teqfw/web-source-installer` plugin.

## 0.21.0

* Updates `bin/tequila.mjs`.
* Adds the zipped cache for the Service Worker.
* Standardizes the plugin-related code.
* Improves `TeqFw_Web_Front_App_Store_IDB`.
* Adds 'upgrade-on-version-change' functionality.
* Appends CSS style.

## 0.20.2

* The `@teqfw/di` restructure.
* The modification of the initialization of namespaces for the front.
* The logger initialization is moved to the post-processor.

## 0.20.1

* Fix namespace mapping for offline mode (from the cache).

## 0.20.0

* These changes are related to the new architecture of the `@teqfw/di` package.

## 0.11.0

* Add a list of HTTP request handlers in the order of processing to the log.
* Fix default value of 'HTTP_STATUS_OK' when page is not found.
* Allow WebSocket handlers w/o `process()` method.

## 0.10.0

* Remove plugin's init/stop functionality.
* Add 'useWebSocket' option to local configuration.

## 0.9.0

* `TeqFw_Web_Back_Util_Cookie` is added.

## 0.8.2

* Hotfix for Windows paths in Statics handler.

## 0.8.1

* Hotfix for Windows delimiters.

## 0.8.0

* Restructure directories and files.
* Add process to monitor online/offline modes.
* Add fronts logs collector.
* Fix 'space' signature in `TeqFw_Web_Back_Mod_Address.parsePath`.
* Renew DTO structures.
* Add web socket support.

## 0.7.1

* Add shared objects' registry for HTTP request/response.
* Respond 404 for missed static resource.
* Add 'content-type' header to service worker request for files to caching.
* Clean up deprecated code.
* Clean up DTO features from 'TeqFw_Web_Back_App_Server_Handler_WAPI_Context'.
* Restructure directories & files.

## 0.7.0

* Ability to start in HTTP/1.1, HTTP/2 and HTTPS over HTTP/2 modes.
* Start w/o PID file (for readonly filesystems like Google AppEngine).
* Base handlers for files uploading and Server Sent Events.
* SW cache cleaning.
* IDB store for front objects.

## 0.6.0

* Cast function for DTOs.
* Bind to DI-plugin areas.
* Service worker core functionality.
* Service to get list of files to cache in SW.
* Messaging API to connect SW with app.
* SW configuration (cache status, etc.).

## 0.5.0

* docs for plugin's teq-descriptor;
* remove `root` option from teq-descriptor;
* use `@teqfw/web.handlers` in `./teqfw.json` as an object and not as an array;
* use `@teqfw/di.replace` in `./teqfw.json` as an object and not as an array;
* improve handlers initialization in `TeqFw_Web_Back_App_Server_Handler_Registry`;
* improve error logging in `TeqFw_Web_Back_Plugin_Web_Handler_Service`;
