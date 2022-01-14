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


// MODULE'S CLASSES
// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Web_Back_Api_Dispatcher_IHandler
 * @implements TeqFw_Core_Shared_Api_Event_IBus
 */
export default class TeqFw_Web_Back_App_Server_Handler_Event_Reverse {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Core_Back_App_UUID} */
        const backUUID = spec['TeqFw_Core_Back_App_UUID$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal} */
        const portalFront = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal$'];
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {TeqFw_Web_Back_App_Server_Respond.respond400|function} */
        const respond400 = spec['TeqFw_Web_Back_App_Server_Respond.respond400'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Registry} */
        const registry = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Registry$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Stream.Factory} */
        const fConn = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Stream.Factory$'];
        /** @type {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened} */
        const esbOpened = spec['TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened$'];
        /** @type {TeqFw_Web_Back_Event_Stream_Reverse_Opened} */
        const ebOpened = spec['TeqFw_Web_Back_Event_Stream_Reverse_Opened$'];

        // DEFINE WORKING VARS / PROPS
        /**
         * UUID for this backup instance.
         * @type {string}
         */
        const _backUUID = backUUID.get();
        // const thisRequestHandler = this;

        // MAIN FUNCTIONALITY
        Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});

        // DEFINE INNER FUNCTIONS
        /**
         * Extract, validate and return front application UUID or 'null' otherwise.
         * @param {string} url
         * @return {string|null}
         */
        function getFrontAppUUID(url) {
            const connId = url.split('/').pop();
            return validate(connId) ? connId : null;
        }

        function sendHeaders(res) {
            res.writeHead(HTTP_STATUS_OK, {
                [HTTP2_HEADER_CONTENT_TYPE]: 'text/event-stream',
                [HTTP2_HEADER_CACHE_CONTROL]: 'no-cache',
            });
        }

        /**
         * Process HTTP request if not processed before.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @memberOf TeqFw_Web_Back_App_Server_Handler_Event_Reverse
         */
        async function process(req, res) {
            // INNER FUNCTIONS

            // MAIN FUNCTIONALITY
            /** @type {TeqFw_Core_Shared_Mod_Map} */
            const shares = res[DEF.HNDL_SHARE];
            if (!res.headersSent && !shares.get(DEF.SHARE_RES_STATUS)) {
                // extract front application UUID
                const frontUUID = getFrontAppUUID(req.url);
                if (frontUUID) {
                    const streamUUID = v4(); // generate new UUID for newly established connection
                    let conn = registry.getByFrontUUID(frontUUID);
                    if (conn) registry.delete(conn.streamId);
                    conn = fConn.create();
                    registry.put(conn, streamUUID, frontUUID);
                    logger.info(`Front app '${frontUUID}' established new stream for back-to-front events.`);
                    // set 'write' function to connection, response stream is pinned in closure
                    conn.write = function (payload) {
                        if (res.writable) {
                            const json = JSON.stringify(payload);
                            res.write(`data: ${json}\n\n`);
                            res.write(`id: ${conn.messageId++}\n`);
                        } else {
                            logger.error(`Back-to-front events stream is not writable (front: '${frontUUID}')`);
                        }
                    };
                    conn.finalize = () => {
                        res.end();
                    }
                    // remove stream from registry on close
                    res.addListener('close', () => {
                        registry.delete(streamUUID);
                        // TODO: publish local event here and process it in TeqFw_User_Back_Mod_Event_Stream_Registry
                        // TODO: ... to cleanup users registry
                        logger.info(`Back-to-front events stream is closed (front: '${frontUUID}').`);
                    });

                    // respond with headers only to start events stream
                    sendHeaders(res);

                    // send connection data as the first transborder event
                    const transMsg = esbOpened.createDto();
                    const transData = transMsg.data;
                    transData.backUUID = _backUUID;
                    transData.frontUUID = frontUUID;
                    transData.streamUUID = streamUUID;
                    const transMeta = transMsg.meta;
                    transMeta.frontUUID = frontUUID;
                    portalFront.publish(transMsg);

                    // emit local event
                    const localMsg = ebOpened.createDto();
                    const localData = localMsg.data;
                    localData.backUUID = _backUUID;
                    localData.frontUUID = frontUUID;
                    localData.streamUUID = streamUUID;
                    eventsBack.publish(localMsg);
                } else respond400(res);
            }
        }

        // DEFINE INSTANCE METHODS

        this.getProcessor = () => process;

        this.init = async function () {
            logger.info(`Initialize Reverse Events Stream handler for web requests:`);
        }

        this.requestIsMine = function ({method, address} = {}) {
            return (
                (method === HTTP2_METHOD_GET)
                && (address?.space === DEF.SHARED.SPACE_EVENT_REVERSE)
            );
        }

    }
}
