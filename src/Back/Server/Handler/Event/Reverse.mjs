/**
 * Web server handler to establish event stream from back to front (reverse channel).
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';
import {validate, v4} from 'uuid';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Server_Handler_Event_Reverse';
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
 * @implements TeqFw_Core_Shared_Api_Event_IProducer
 */
export default class TeqFw_Web_Back_Server_Handler_Event_Reverse {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Web_Back_Server_Respond.respond400|function} */
        const respond400 = spec['TeqFw_Web_Back_Server_Respond.respond400'];
        /** @type {TeqFw_Web_Back_Server_Event_Stream_Reverse_Registry} */
        const regConnReverse = spec['TeqFw_Web_Back_Server_Event_Stream_Reverse_Registry$'];
        /** @type {TeqFw_Web_Back_Server_Event_Stream_Reverse_Stream.Factory} */
        const fConn = spec['TeqFw_Web_Back_Server_Event_Stream_Reverse_Stream.Factory$'];
        /** @type {TeqFw_Core_Back_App_UUID} */
        const backAppUUID = spec['TeqFw_Core_Back_App_UUID$'];
        /** @type {TeqFw_Web_Back_Server_Event_Queue} */
        const eventQueue = spec['TeqFw_Web_Back_Server_Event_Queue$'];
        /** @type {TeqFw_Web_Back_Event_Stream_Reverse_Opened} */
        const ebOpened = spec['TeqFw_Web_Back_Event_Stream_Reverse_Opened$'];
        /** @type {TeqFw_Web_Shared_Event_Stream_Reverse_Opened} */
        const esOpened = spec['TeqFw_Web_Shared_Event_Stream_Reverse_Opened$'];
        /** @type {TeqFw_Core_Shared_Mod_Event_Producer} */
        const baseProducer = spec['TeqFw_Core_Shared_Mod_Event_Producer$$']; // instance

        // DEFINE WORKING VARS / PROPS
        /**
         * UUID for this backup instance.
         * @type {string}
         */
        const _backUUID = backAppUUID.get();
        const thisRequestHandler = this;

        // MAIN FUNCTIONALITY
        Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
        Object.assign(this, baseProducer); // new base instance for every current instance

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
         * @memberOf TeqFw_Web_Back_Server_Handler_Event_Reverse
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
                    let conn = regConnReverse.getByFrontUUID(frontUUID);
                    if (!conn) {
                        conn = fConn.create();
                        regConnReverse.put(conn, streamUUID, frontUUID);
                        logger.info(`New front app established reverse events stream: '${frontUUID.substr(0, 8)}...'.`);
                    } else {
                        logger.info(`Front app tries to re-established reverse events stream: '${frontUUID.substr(0, 8)}...'.`);
                    }
                    if (conn.write) logger.info(`Is this connection closed (${frontUUID.substr(0, 8)})?`);
                    // set 'write' function to connection, response stream is pinned in closure
                    conn.write = function (payload) {
                        const json = JSON.stringify(payload);
                        res.write(`data: ${json}\n\n`);
                        res.write(`id: ${conn.messageId++}\n`);
                    };
                    conn.finalize = () => res.end();
                    // remove stream from registry on close
                    res.addListener('close', () => {
                        regConnReverse.delete(streamUUID);
                        logger.info(`Reverse events stream is closed (front app id: ${frontUUID.substr(0, 8)}...).`);
                    });

                    // respond with headers only to start events stream
                    sendHeaders(res);

                    // send connection data as the first transborder event
                    const transEvent = esOpened.createDto();
                    transEvent.backUUID = _backUUID;
                    transEvent.frontUUID = frontUUID;
                    transEvent.streamUUID = streamUUID;
                    eventQueue.add(frontUUID, esOpened.getName(), transEvent);

                    // emit local event
                    const localEvent = ebOpened.createDto();
                    localEvent.backUUID = _backUUID;
                    localEvent.frontUUID = frontUUID;
                    localEvent.streamUUID = streamUUID;
                    thisRequestHandler.emit(ebOpened.getName(), localEvent);
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
