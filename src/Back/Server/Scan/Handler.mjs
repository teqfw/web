/**
 * Action to scan for web requests handlers and to populate handlers registry.
 * @namespace TeqFw_Web_Back_Server_Scan_Handler
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Server_Scan_Handler';

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
    /** @type {TeqFw_Web_Back_Dto_Plugin_Desc.Factory} */
    const fDesc = spec['TeqFw_Web_Back_Dto_Plugin_Desc.Factory$'];
    /** @type {TeqFw_Core_Shared_Util_BeforeAfter} */
    const utilSort = spec['TeqFw_Core_Shared_Util_BeforeAfter$$'];
    /** @type {typeof TeqFw_Core_Shared_Util_BeforeAfter.Dto} */
    const DtoSort = spec['TeqFw_Core_Shared_Util_BeforeAfter.Dto'];

    // DEFINE INNER FUNCTIONS
    /**
     * @return {Promise<*>}
     * @memberOf TeqFw_Web_Back_Server_Scan_Handler
     */
    async function act() {
        // DEFINE INNER FUNCTIONS

        /**
         * Create handlers and populate sort util with before-after data.
         * @param utilSort
         * @return {Promise<Object<string, TeqFw_Web_Back_Api_Request_IHandler>>}
         */
        async function createHandlers(utilSort) {
            const res = {};
            const plugins = regPlugins.items();
            for (const plugin of plugins) {
                /** @type {TeqFw_Web_Back_Dto_Plugin_Desc} */
                const desc = fDesc.create(plugin.teqfw[DEF.SHARED.NAME]);
                for (const hName of Object.keys(desc.handlers)) {
                    logger.info(`Create Web handler: ${hName}`);
                    /** @type {TeqFw_Web_Back_Dto_Plugin_Desc_Handler} */
                    const dto = desc.handlers[hName];
                    /** @type {TeqFw_Web_Back_Api_Request_IHandler} */
                    const handler = await container.get(`${hName}$`);
                    if (typeof handler.init === 'function') await handler.init();
                    res[hName] = handler;
                    const orderDto = new DtoSort();
                    orderDto.id = hName;
                    orderDto.after = dto.after;
                    orderDto.before = dto.before;
                    utilSort.addItem(orderDto);
                }
            }
            return res;
        }

        // MAIN FUNCTIONALITY
        utilSort.reset();
        const handlers = await createHandlers(utilSort);
        const ordered = utilSort.getOrdered();
        const res = [];
        for (const ns of ordered)
            res.push(handlers[ns]);
        return res;
    }

    // MAIN FUNCTIONALITY
    Object.defineProperty(act, 'name', {value: `${NS}.act`});
    return act;
}
