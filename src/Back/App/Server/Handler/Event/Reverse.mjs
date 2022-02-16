/**
 * Web server handler to establish event stream from back to front (reverse channel).
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';
import {validate, v4} from 'uuid';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_App_Server_Handler_Event_Reverse';
const {
    HTTP2_HEADER_CACHE_CONTROL,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_METHOD_GET,
    HTTP_STATUS_OK,
} = H2;
const RECONNECT_TIMEOUT = 500; // browser's reconnect timeout on connection loose
const DISCONNECT_TIMEOUT = 10000; // disconnect stream if not authenticated in 10 sec.

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Back_Api_Dispatcher_IHandler
 */
export default class TeqFw_Web_Back_App_Server_Handler_Event_Reverse {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Core_Back_Mod_App_Uuid} */
        const backUUID = spec['TeqFw_Core_Back_Mod_App_Uuid$'];
        /** @type {TeqFw_Web_Back_App_Server_Respond.respond400|function} */
        const respond400 = spec['TeqFw_Web_Back_App_Server_Respond.respond400'];
        /** @type {TeqFw_Web_Back_Mod_Event_Reverse_Registry} */
        const registry = spec['TeqFw_Web_Back_Mod_Event_Reverse_Registry$'];
        /** @type {TeqFw_Web_Back_Mod_Event_Reverse_Stream.Factory} */
        const factStream = spec['TeqFw_Web_Back_Mod_Event_Reverse_Stream.Factory$'];
        /** @type {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticate_Request} */
        const esbAuthReq = spec['TeqFw_Web_Shared_Event_Back_Stream_Reverse_Authenticate_Request$'];
        /** @type {TeqFw_Web_Back_Mod_Server_Key} */
        const modServerKey = spec['TeqFw_Web_Back_Mod_Server_Key$'];

        // ENCLOSED VARS
        /**
         * UUID for this backup instance.
         * @type {string}
         */
        const _backUuid = backUUID.get();
        let _serverPubKey;

        // MAIN
        Object.defineProperty(process, 'namespace', {value: `${NS}.${process.name}`});

        // ENCLOSED FUNCS

        /**
         * Process HTTP request if not processed before.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @memberOf TeqFw_Web_Back_App_Server_Handler_Event_Reverse
         */
        async function process(req, res) {
            // ENCLOSED FUNCS
            /**
             * Extract, validate as UUID and return front application UUID or 'null' otherwise.
             * @param {string} url
             * @return {string|null}
             */
            function getFrontAppUUID(url) {
                const connId = url.split('/').pop();
                return validate(connId) ? connId : null;
            }

            /**
             * Write headers to SSE stream to start streaming.
             * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
             */
            function startStreaming(res) {
                res.writeHead(HTTP_STATUS_OK, {
                    [HTTP2_HEADER_CONTENT_TYPE]: 'text/event-stream',
                    [HTTP2_HEADER_CACHE_CONTROL]: 'no-cache',
                });
            }

            /**
             * Create reverse events stream for connected front app.
             * @param {string} frontUuid
             * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
             * @return {string} stream UUID
             * @memberOf TeqFw_Web_Back_App_Server_Handler_Event_Reverse.process
             */
            function createStream(frontUuid, res) {
                // ENCLOSED VARS
                const streamUuid = v4(); // generate new UUID for newly established connection
                const metaLog = {frontUuid, streamUuid};

                // ENCLOSED FUNCS
                /**
                 * Listener to remove events stream from registry.
                 */
                function onClose() {
                    registry.delete(streamUuid);

                    logger.info(`Back-to-front events stream is closed (front: '${frontUuid}').`, metaLog);
                }

                // MAIN
                const streamExist = registry.getByFrontUUID(frontUuid, false);
                if (streamExist) registry.delete(streamExist.streamId);
                const stream = factStream.create();
                registry.put(stream, streamUuid, frontUuid);
                logger.info(`Front app '${frontUuid}' opened new reverse stream (back-to-front events).`, metaLog);
                // set 'write' function to connection, response stream is pinned in closure
                stream.write = function (payload) {
                    if (res.writable) {
                        const json = JSON.stringify(payload);
                        res.write(`data: ${json}\n\n`);
                        res.write(`id: ${stream.messageId++}\n`);
                    } else {
                        logger.error(`Events reverse stream is not writable (front: '${frontUuid}')`, metaLog);
                    }
                };
                stream.finalize = () => {
                    res.end();
                }
                stream.unauthenticatedCloseId = setTimeout(() => res.end(), DISCONNECT_TIMEOUT);
                // remove stream from registry on close
                res.addListener('close', onClose);
                return streamUuid;
            }

            function authenticateStream(streamUuid, frontUuid, res) {
                if (res.writable) {
                    const event = esbAuthReq.createDto();
                    event.data.backUUID = _backUuid;
                    event.data.serverKey = _serverPubKey;
                    event.meta.frontUUID = frontUuid;
                    event.meta.backUUID = _backUuid;
                    const json = JSON.stringify(event);
                    res.write(`event: ${DEF.SHARED.EVENT_AUTHENTICATE}\n`);
                    res.write(`retry: ${RECONNECT_TIMEOUT}\n`);
                    res.write(`data: ${json}\n\n`);
                } else {
                    const metaLog = {frontUuid, streamUuid, backUuid: _backUuid};
                    logger.error(`Back-to-front events stream is not writable (${streamUuid}).`, metaLog);
                }
            }

            // MAIN
            /** @type {TeqFw_Core_Shared_Mod_Map} */
            const shares = res[DEF.HNDL_SHARE];
            if (!res.headersSent && !shares.get(DEF.SHARE_RES_STATUS)) {
                // extract front application UUID
                const frontUUID = getFrontAppUUID(req.url);
                if (frontUUID) {
                    const streamUUID = createStream(frontUUID, res);
                    startStreaming(res); // respond with headers only to start events stream
                    authenticateStream(streamUUID, frontUUID, res);
                } else respond400(res);
            }
        }

        // DEFINE INSTANCE METHODS

        // noinspection JSUnusedGlobalSymbols
        this.getProcessor = () => process;

        this.init = async function () {
            _serverPubKey = await modServerKey.getPublic();
            const metaLog = {backUuid: _backUuid};
            logger.info(`Initialize Reverse Events Stream handler for web requests.`, metaLog);
        }

        // noinspection JSUnusedGlobalSymbols
        this.requestIsMine = function ({method, address} = {}) {
            return (
                (method === HTTP2_METHOD_GET)
                && (address?.space === DEF.SHARED.SPACE_EVENT_REVERSE)
            );
        }

    }
}
