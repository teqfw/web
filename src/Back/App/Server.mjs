/**
 * HTTP server to process web requests.
 * Can start in HTTP/1, HTTP/2 & HTTPS modes.
 *
 * @namespace TeqFw_Web_Back_App_Server
 */
// MODULE'S IMPORT
import {createServer as createHttp1Server} from 'node:http';
import {createServer as createSecureServer} from 'node:https';
import {createServer} from 'node:http2';
import {readFileSync} from 'node:fs';
import {WebSocketServer} from 'ws';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_App_Server {
    /**
     * @param {TeqFw_Web_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Core_Back_Config} config
     * @param {TeqFw_Web_Back_App_Server_Dispatcher} dispatcher
     * @param {TeqFw_Web_Back_App_Server_Listener_Socket} listenSocket
     */
    constructor(
        {
            TeqFw_Web_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Core_Back_Config$: config,
            TeqFw_Web_Back_App_Server_Dispatcher$: dispatcher,
            TeqFw_Web_Back_App_Server_Listener_Socket$: listenSocket,
        }) {
        // DEFINE WORKING VARS
        let _serverType; // save type for logs (HTTP/1, HTTP/2, HTTPS)

        // DEFINE THIS INSTANCE METHODS
        this.run = async function ({port, useHttp1, key, cert, useWs} = {}) {
            // FUNCS

            /**
             * Extract server options from local config.
             * @returns {{cfgUseHttp1: boolean, cfgKey: string, cfgCert: string, cfgPort: number, cfgUseWs: boolean}}
             */
            function optionsFromConfig() {
                /** @type {TeqFw_Web_Back_Plugin_Dto_Config_Local.Dto} */
                const cfgLocal = config.getLocal(DEF.SHARED.NAME);
                const cfgCert = cfgLocal?.server?.secure?.cert;
                const cfgKey = cfgLocal?.server?.secure?.key;
                const cfgPort = cfgLocal?.server?.port;
                const cfgUseWs = cfgLocal?.server?.useWebSocket ?? false;
                const cfgUseHttp1 = cfgLocal?.server?.useHttp1;
                return {cfgPort, cfgUseHttp1, cfgKey, cfgCert, cfgUseWs};
            }

            /**
             * @returns {Server}
             */
            function initHttp1() {
                _serverType = 'HTTP/1';
                return createHttp1Server({});
            }

            /**
             * @returns {Http2Server}
             */
            function initHttp2() {
                _serverType = 'HTTP/2';
                return createServer({});
            }

            /**
             * @param {string} key
             * @param {string} cert
             * @returns {Http2SecureServer}
             */
            function initHttps(key, cert) {
                _serverType = 'HTTPS';
                return createSecureServer({
                    key: readFileSync(key),
                    cert: readFileSync(cert)
                });
            }

            // MAIN
            // get startup options from config
            const {cfgPort, cfgUseHttp1, cfgKey, cfgCert, cfgUseWs} = optionsFromConfig();
            port = port ?? (cfgPort) ?? DEF.DATA_SERVER_PORT;
            useHttp1 = useHttp1 ?? cfgUseHttp1 ?? false;
            key = key ?? cfgKey ?? null;
            cert = cert ?? cfgCert ?? null;
            useWs = useWs ?? (cfgUseWs === true);
            if (useHttp1 && (key && cert))
                logger.info(`Option 'useHttp1' is ignored because 'key' and 'cert' options are presented.`);

            // create server
            /** @type {Server|Http2Server|Http2SecureServer} */
            const server = useHttp1 ? initHttp1()
                : (key && cert) ? initHttps(key, cert) : initHttp2();

            // create request handlers, bind dispatcher to request event
            await dispatcher.createHandlers();
            const onRequest = dispatcher.getListener();
            // web server's listeners
            server.on('request', onRequest);
            server.on('err', (err) => {
                logger.error(`Web server is closed on error: ${JSON.stringify(err)}.`);
                server.close();
            });

            if (useWs === true) {
                logger.info(`Web server uses web sockets.`);
                /** @type {WebSocketServer} */
                const socketServer = new WebSocketServer({noServer: true});
                await listenSocket.init();
                const onUpgrade = listenSocket.createListener(socketServer);
                server.on('upgrade', onUpgrade);
            }

            // start server
            server.listen(port);
            const logWs = (useWs === true) ? '(with web sockets)' : '(without web sockets)';
            logger.info(`Web server is started on port ${port} in ${_serverType} mode ${logWs}.`);
        };

    }
}
