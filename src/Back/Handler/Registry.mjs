/**
 * Registry to create and store web server handlers.
 */
export default class TeqFw_Web_Back_Handler_Registry {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Di_Shared_Container} */
        const container = spec['TeqFw_Di_Shared_Container$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Core_Back_Scan_Plugin_Registry} */
        const registry = spec['TeqFw_Core_Back_Scan_Plugin_Registry$'];
        /** @type {TeqFw_Web_Back_Api_Dto_Plugin_Desc.Factory} */
        const fDesc = spec['TeqFw_Web_Back_Api_Dto_Plugin_Desc#Factory$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {Object.<string, TeqFw_Web_Back_Api_Request_IHandler.handle>} */
        const store = {};

        // DEFINE INSTANCE METHODS

        this.init = async function () {
            logger.info('Collect web requests handlers.');
            /** @type {TeqFw_Core_Back_Api_Dto_Plugin_Registry_Item[]} */
            const items = registry.items();
            for (const item of items) {
                // get '/web' node from 'teqfw.json'
                const data = item.teqfw?.[DEF.DESC_NODE];
                if (data) {
                    const desc = fDesc.create(data);
                    for (const one of desc.handlers) {
                        // create handler factory...
                        const depId = one.factoryId;
                        /** @type {TeqFw_Web_Back_Api_Request_IHandler.Factory} */
                        const factory = await container.get(`${depId}$`);
                        // ...then create handler itself
                        store[depId] = await factory.create();
                    }
                }
            }
            const total = Object.values(store).length;
            logger.info(`Total ${total} web requests handlers are created.`);
        };

        /**
         * @return {TeqFw_Web_Back_Api_Request_IHandler.handle[]}
         */
        this.items = function () {
            return Object.values(store);
        }
    }
}
