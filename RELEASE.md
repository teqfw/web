# @teqfw/web: releases

# 0.9.0 - NEW

# 0.8.0

* Restructure directories and files.
* Add process to monitor online/offline modes.
* Add fronts logs collector.
* Fix 'space' signature in `TeqFw_Web_Back_Mod_Address.parsePath`.
* Renew DTO structures.
* Add web socket support.

# 0.7.1

* Add shared objects' registry for HTTP request/response.
* Respond 404 for missed static resource.
* Add 'content-type' header to service worker request for files to caching.
* Clean up deprecated code.
* Clean up DTO features from 'TeqFw_Web_Back_App_Server_Handler_WAPI_Context'.
* Restructure directories & files.

# 0.7.0

* Ability to start in HTTP/1.1, HTTP/2 and HTTPS over HTTP/2 modes.
* Start w/o PID file (for readonly filesystems like Google AppEngine).
* Base handlers for files uploading and Server Sent Events.
* SW cache cleaning.
* IDB store for front objects.

# 0.6.0

* Cast function for DTOs.
* Bind to DI-plugin areas.
* Service worker core functionality.
* Service to get list of files to cache in SW.
* Messaging API to connect SW with app.
* SW configuration (cache status, etc.).

# 0.5.0

* docs for plugin's teq-descriptor;
* remove `root` option from teq-descriptor;
* use `@teqfw/web.handlers` in `./teqfw.json` as an object and not as an array;
* use `@teqfw/di.replace` in `./teqfw.json` as an object and not as an array;
* improve handlers initialization in `TeqFw_Web_Back_App_Server_Handler_Registry`;
* improve error logging in `TeqFw_Web_Back_Plugin_Web_Handler_Service`;
