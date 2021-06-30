/**
 * Registry to store data about web server handlers.
 */
export default class TeqFw_Web_Back_Handler_Registry {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Defaults} */
        const DEF = spec['TeqFw_Web_Defaults$'];
        /** @type {TeqFw_Di_Container} */
        const container = spec['TeqFw_Di_Container$'];
        /** @type {TeqFw_Core_Logger} */
        const logger = spec['TeqFw_Core_Logger$'];
        /** @type {TeqFw_Core_Back_Scan_Plugin_Registry} */
        const registry = spec['TeqFw_Core_Back_Scan_Plugin_Registry$'];
        /** @type {TeqFw_Web_Back_Api_Dto_Plugin_Desc.Factory} */
        const fDesc = spec['TeqFw_Web_Back_Api_Dto_Plugin_Desc#Factory$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {Object.<string, Function>} */
        const store = {};

        // DEFINE INSTANCE METHODS

        this.init = async function () {
            logger.debug('Collect web requests handlers.');
            /** @type {TeqFw_Core_Back_Api_Dto_Plugin_Registry_Item[]} */
            const items = registry.items();
            for (const item of items) {
                const data = item.teqfw?.[DEF.REALM];
                if (data) {
                    const desc = fDesc.create(data);
                    for (const one of desc.handlers) {
                        const depId = one.factoryId;
                        store[depId] = await container.get(`${depId}$`);
                    }
                }
            }
            const total = Object.values(store).length;
            logger.debug(`Total ${total} web requests handlers are created.`);
        };

        this.items = function () {
            return Object.values(store);
        }
    }
}
