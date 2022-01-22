/**
 * Frontend logger that prints messages to console and sends it to the server.
 *
 * @namespace TeqFw_Web_Front_App_Logger
 */
export default class TeqFw_Web_Front_App_Logger {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
        const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
        /** @type {TeqFw_Web_Shared_Event_Front_Log} */
        const esfLog = spec['TeqFw_Web_Shared_Event_Front_Log$'];

        // INSTANCE METHODS
        this.info = function (msg) {
            const message = esfLog.createDto();
            message.data.body = msg;
            portalBack.publish(message);
            logger.info(msg);
        }

        this.error = function (msg) {
            const message = esfLog.createDto();
            message.data.body = msg;
            portalBack.publish(message);
            logger.error(msg);
        };

        /**
         * Pause/unpause console logger.
         * @param {boolean} data
         */
        this.pause = function (data) {
            logger.pause(data);
        }
    }
}
