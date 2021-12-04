/**
 * Registry to create and store web server handlers.
 * @namespace TeqFw_Web_Back_Handler_Registry
 */

/**
 * @memberOf TeqFw_Web_Back_Handler_Registry
 */
class Entry {
    /** @type {TeqFw_Web_Back_Api_Request_IHandler.handle} */
    handler;
    /** @type {number} */
    weight;
}

export default class TeqFw_Web_Back_Handler_Registry {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Di_Shared_Container} */
        const container = spec['TeqFw_Di_Shared_Container$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {Function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast#castInt'];
        /** @type {TeqFw_Core_Back_Scan_Plugin_Registry} */
        const registry = spec['TeqFw_Core_Back_Scan_Plugin_Registry$'];
        /** @type {TeqFw_Web_Back_Dto_Plugin_Desc.Factory} */
        const fDesc = spec['TeqFw_Web_Back_Dto_Plugin_Desc#Factory$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {TeqFw_Web_Back_Api_Request_IHandler.handle[]} */
        let _handles = [];


        // DEFINE INSTANCE METHODS

        this.init = async function () {
            logger.info('Collect web requests handlers.');
            /** @type {TeqFw_Web_Back_Handler_Registry.Entry[]} */
            const entries = [];
            /** @type {TeqFw_Core_Back_Api_Dto_Plugin_Registry_Item[]} */
            const items = registry.items();
            for (const item of items) {
                // get '/web' node from 'teqfw.json'
                const data = item.teqfw?.[DEF.SHARED.NAME];
                if (data) {
                    const desc = fDesc.create(data);
                    for (const depId of Object.keys(desc.handlers)) {
                        const one = desc.handlers[depId];
                        // create handler factory...
                        /** @type {TeqFw_Web_Back_Api_Request_IHandler.Factory} */
                        const factory = await container.get(`${depId}$`);
                        // ...then create handler itself
                        const entry = new Entry();
                        const handler = (typeof factory.create === 'function') ? await factory.create() : factory;
                        entry.handler = handler;
                        entry.weight = castInt(one.weight) || 0;
                        entries.push(entry);
                    }
                }
            }
            // sort handles by weight
            entries.sort((a, b) => b.weight - a.weight); // reverse order: 100 => 10
            _handles = entries.map((a) => a.handler);
            const total = _handles.length;
            logger.info(`Total ${total} web requests handlers are created.`);
        };

        /**
         * @return {TeqFw_Web_Back_Api_Request_IHandler.handle[]}
         */
        this.items = function () {
            return _handles;
        }
    }
}
