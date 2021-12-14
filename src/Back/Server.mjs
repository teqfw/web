/**
 * HTTP server to process web requests.
 * Can start in HTTP/1, HTTP/2 & HTTPS modes.
 *
 * @namespace TeqFw_Web_Back_Server
 */
// MODULE'S IMPORT
import {createServer as createHttp1Server} from 'http';
import {createSecureServer, createServer} from 'http2';
import {readFileSync} from 'fs';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Server {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];
        /** @type {TeqFw_Web_Back_Server_Dispatcher} */
        const dispatcher = spec['TeqFw_Web_Back_Server_Dispatcher$'];

        // DEFINE WORKING VARS
        let _serverType; // save type for logs (HTTP/1, HTTP/2, HTTPS)

        // DEFINE THIS INSTANCE METHODS
        this.run = async function ({port, useHttp1, key, cert} = {}) {
            // DEFINE INNER FUNCTIONS

            /**
             * Extract server options from local config.
             * @return {{cfgUseHttp1: boolean, cfgKey: string, cfgCert: string, cfgPort: number}}
             */
            function optionsFromConfig() {
                /** @type {TeqFw_Web_Back_Dto_Config_Local} */
                const cfgLocal = config.getLocal(DEF.SHARED.NAME);
                const cfgPort = cfgLocal?.server?.port;
                const cfgUseHttp1 = cfgLocal?.server?.useHttp1;
                const cfgKey = cfgLocal?.server?.secure?.key;
                const cfgCert = cfgLocal?.server?.secure?.cert;
                return {cfgPort, cfgUseHttp1, cfgKey, cfgCert};
            }

            function initHttp1() {
                _serverType = 'HTTP/1';
                return createHttp1Server({});
            }

            function initHttp2() {
                _serverType = 'HTTP/2';
                return createServer({});
            }

            function initHttps(key, cert) {
                _serverType = 'HTTPS';
                return createSecureServer({
                    key: readFileSync(key),
                    cert: readFileSync(cert)
                });
            }

            // MAIN FUNCTIONALITY
            // get startup options from config
            const {cfgPort, cfgUseHttp1, cfgKey, cfgCert} = optionsFromConfig();
            port = port ?? (cfgPort) ?? DEF.DATA_SERVER_PORT;
            useHttp1 = useHttp1 ?? cfgUseHttp1 ?? false;
            key = key ?? cfgKey ?? null;
            cert = cert ?? cfgCert ?? null;
            if (useHttp1 && (key && cert))
                logger.info(`Option 'useHttp1' is ignored because 'key' and 'cert' options are presented.`);

            // create server
            const server = useHttp1 ? initHttp1()
                : (key && cert) ? initHttps(key, cert) : initHttp2();

            // create request handlers, bind dispatcher to request event
            await dispatcher.createHandlers();
            const onRequest = dispatcher.getListener();
            server.on('request', onRequest);
            server.on('err', (err) => {
                logger.error(`Web server is closed on error: ${JSON.stringify(err)}.`);
                server.close();
            });


            // start server
            server.listen(port);
            logger.info(`Web server is started on port ${port} in ${_serverType} mode.`);
        }

    }
}
