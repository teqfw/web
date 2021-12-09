/**
 * Action to scan for web requests handlers and to populate handlers registry.
 * @namespace TeqFw_Web_Back_Scan_Handler
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Scan_Handler';

// MODULE'S FUNCTIONS
export default function (spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Web_Back_Defaults} */
    const DEF = spec['TeqFw_Web_Back_Defaults$'];
    /** @type {TeqFw_Di_Shared_Container} */
    const container = spec['TeqFw_Di_Shared_Container$'];
    /** @type {TeqFw_Core_Shared_Logger} */
    const logger = spec['TeqFw_Core_Shared_Logger$'];
    /** @type {TeqFw_Core_Back_Scan_Plugin_Registry} */
    const regPlugins = spec['TeqFw_Core_Back_Scan_Plugin_Registry$'];
    /** @type {TeqFw_Web_Back_Scan_Handler_Registry} */
    const regHandlers = spec['TeqFw_Web_Back_Scan_Handler_Registry$'];
    /** @type {TeqFw_Web_Back_Dto_Plugin_Desc.Factory} */
    const fDesc = spec['TeqFw_Web_Back_Dto_Plugin_Desc.Factory$'];
    /** @type {TeqFw_Web_Back_Scan_Handler_Listener} */
    const metaListener = spec['TeqFw_Web_Back_Scan_Handler_Listener$'];

    // DEFINE WORKING VARS / PROPS

    // DEFINE INNER FUNCTIONS
    /**
     * @param {string} title
     * @param {string} body
     * @return {Promise<{msgId, code}>}
     * @memberOf TeqFw_Web_Back_Scan_Handler
     */
    async function act({title, body}) {
        // DEFINE INNER FUNCTIONS
        async function createHandlers() {
            const plugins = regPlugins.items();
            for (const plugin of plugins) {
                /** @type {TeqFw_Web_Back_Dto_Plugin_Desc} */
                const desc = fDesc.create(plugin.teqfw[DEF.SHARED.NAME]);
                for (const hName of Object.keys(desc.handlers)) {
                    logger.info(`Create Web handler: ${hName}`);
                    /** @type {TeqFw_Web_Back_Dto_Plugin_Desc_Handler} */
                    const dto = desc.handlers[hName];
                    /** @type {TeqFw_Web_Back_Api_IHandler} */
                    const handler = await container.get(`${hName}$`);
                    if (typeof handler.createListeners === 'function') await handler.createListeners();
                    // for all available events
                    for (const eName of Object.keys(dto.events)) {
                        const event = dto.events[eName];
                        // noinspection JSCheckFunctionSignatures
                        const listener = metaListener.createDto(event);
                        listener.event = eName.toLowerCase();
                        listener.ns = hName;
                        listener.listener = handler.getListener(eName);
                        regHandlers.add(listener);
                    }
                }
            }
        }

        // MAIN FUNCTIONALITY
        await createHandlers();
        regHandlers.order();
    }

    // MAIN FUNCTIONALITY
    Object.defineProperty(act, 'name', {value: `${NS}.act`});
    return act;
}
