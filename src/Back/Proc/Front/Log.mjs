/**
 * Process to printout log messages from fronts.
 *
 * @namespace TeqFw_Web_Back_Proc_Front_Log
 */
export default class TeqFw_Web_Back_Proc_Front_Log {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$'];
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {TeqFw_Web_Shared_Event_Front_Log} */
        const esfLog = spec['TeqFw_Web_Shared_Event_Front_Log$'];

        // MAIN
        eventsBack.subscribe(esfLog.getEventName(), onLog);

        // ENCLOSED FUNCTIONS
        /**
         * @param {TeqFw_Web_Shared_Event_Front_Log.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        function onLog({data, meta}) {
            const frontUUID = meta.frontUUID;
            const body = data.body;
            // TODO: enable front logs on the back
            // logger.info(`${frontUUID}: ${body}`);
        }

    }
}
