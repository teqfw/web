/**
 * Web server handler to receive 'front-to-back' events (direct stream).
 * Handler verifies stamps of the event messages and publishes their to backend event bus.
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_App_Server_Handler_Event_Direct';
const {
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_METHOD_POST,
    HTTP_STATUS_OK,
    HTTP_STATUS_UNAUTHORIZED,
} = H2;


// MODULE'S CLASSES
// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Web_Back_Api_Dispatcher_IHandler
 */
export default class TeqFw_Web_Back_App_Server_Handler_Event_Direct {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Web_Back_App_Server_Respond.respond500|function} */
        const respond500 = spec['TeqFw_Web_Back_App_Server_Respond.respond500'];
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventBus = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const factTransMsg = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];
        /** @type {TeqFw_Web_Shared_Dto_Event_Direct_Response} */
        const dtoRes = spec['TeqFw_Web_Shared_Dto_Event_Direct_Response$'];
        /** @type {TeqFw_Web_Back_Mod_Event_Stamper_Factory} */
        const factStamper = spec['TeqFw_Web_Back_Mod_Event_Stamper_Factory$'];
        /** @type {TeqFw_Core_Back_Mod_App_Uuid} */
        const modBackUuid = spec['TeqFw_Core_Back_Mod_App_Uuid$'];
        /** @type {TeqFw_Web_Shared_Dto_Log_Meta_Event} */
        const dtoLogMeta = spec['TeqFw_Web_Shared_Dto_Log_Meta_Event$'];

        // MAIN
        Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
        logger.setNamespace(this.constructor.name);

        // FUNCS
        /**
         * Process HTTP request if not processed before.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @memberOf TeqFw_Web_Back_App_Server_Handler_Event_Direct
         */
        async function process(req, res) {
            // FUNCS
            /**
             * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
             */
            function logEvent(meta) {
                const logMeta = dtoLogMeta.createDto();
                logMeta.backUuid = modBackUuid.get();
                logMeta.eventName = meta.name;
                logMeta.eventUuid = meta.uuid;
                logMeta.frontUuid = meta.frontUUID;
                logger.info(`${meta.frontUUID} => ${meta.name} (${meta.uuid}).`, logMeta);
            }

            // MAIN
            /** @type {TeqFw_Core_Shared_Mod_Map} */
            const shares = res[DEF.HNDL_SHARE];
            if (!res.headersSent && !shares.get(DEF.SHARE_RES_STATUS)) {
                let frontUuid, eventUuid;
                const json = shares.get(DEF.SHARE_REQ_BODY_JSON);
                try {
                    const message = factTransMsg.createDto(json);
                    const meta = message.meta;
                    frontUuid = meta.frontUUID;
                    eventUuid = meta.uuid;
                    // load public key using front UUID then validate encryption stamp
                    const stamper = await factStamper.create({frontUuid});
                    const valid = stamper.verify(message.stamp, meta);
                    if (valid) {
                        // stamp is valid, log event then publish it to backend event bus
                        logEvent(meta);
                        eventBus.publish(message);
                        // respond as succeed
                        res.setHeader(HTTP2_HEADER_CONTENT_TYPE, 'application/json');
                        const eventRes = dtoRes.createDto();
                        eventRes.success = true;
                        shares.set(DEF.SHARE_RES_BODY, JSON.stringify(eventRes));
                        shares.set(DEF.SHARE_RES_STATUS, HTTP_STATUS_OK);
                    } else {
                        const msg = `Front #${frontUuid} is not authenticated.`;
                        shares.set(DEF.SHARE_RES_STATUS, HTTP_STATUS_UNAUTHORIZED);
                        shares.set(DEF.SHARE_RES_BODY, msg);
                        logger.error(msg);
                    }
                } catch (e) {
                    logger.error(`Error for event #${frontUuid}/${eventUuid}: ${e?.message}`);
                    respond500(res, e?.message);
                }
            }
        }

        // DEFINE INSTANCE METHODS

        this.getProcessor = () => process;

        this.init = async function () {
            logger.info(`Initialize Direct Events Stream handler for web requests:`);
        }

        this.requestIsMine = function ({method, address} = {}) {
            return (
                (method === HTTP2_METHOD_POST)
                && (address?.space === DEF.SHARED.SPACE_EVENT_DIRECT)
            );
        }
    }
}
