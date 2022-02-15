/**
 * Action to scan for web requests handlers and to populate handlers registry.
 * @namespace TeqFw_Web_Back_App_Server_Scan_Handler
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_App_Server_Scan_Handler';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Web_Back_Defaults} */
    const DEF = spec['TeqFw_Web_Back_Defaults$'];
    /** @type {TeqFw_Di_Shared_Container} */
    const container = spec['TeqFw_Di_Shared_Container$'];
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$'];
    /** @type {TeqFw_Core_Back_App_Init_Plugin_Registry} */
    const regPlugins = spec['TeqFw_Core_Back_App_Init_Plugin_Registry$'];
    /** @type {TeqFw_Web_Back_Dto_Plugin_Desc.Factory} */
    const fDesc = spec['TeqFw_Web_Back_Dto_Plugin_Desc.Factory$'];
    /** @type {TeqFw_Core_Shared_Util_BeforeAfter} */
    const utilSort = spec['TeqFw_Core_Shared_Util_BeforeAfter$$'];
    /** @type {typeof TeqFw_Core_Shared_Util_BeforeAfter.Dto} */
    const DtoSort = spec['TeqFw_Core_Shared_Util_BeforeAfter.Dto'];

    // ENCLOSED FUNCS
    /**
     * @return {Promise<*>}
     * @memberOf TeqFw_Web_Back_App_Server_Scan_Handler
     */
    async function act() {
        // ENCLOSED FUNCS

        /**
         * Create handlers and populate sort util with before-after data.
         * @param utilSort
         * @return {Promise<Object<string, TeqFw_Web_Back_Api_Dispatcher_IHandler>>}
         */
        async function createHandlers(utilSort) {
            const res = {};
            /** @type {Object<string, TeqFw_Web_Back_Dto_Plugin_Desc_Handler>} */
            const includes = {};
            const excludes = [];
            // scan plugins and get all handlers and excludes
            const plugins = regPlugins.items();
            for (const plugin of plugins) {
                /** @type {TeqFw_Web_Back_Dto_Plugin_Desc} */
                const desc = fDesc.create(plugin.teqfw[DEF.SHARED.NAME]);
                for (const hName of Object.keys(desc.handlers))
                    includes[hName] = desc.handlers[hName];
                const excl = desc?.excludes?.handlers;
                if (excl.length)
                    Array.prototype.push.apply(excludes, excl);
            }
            // remove excludes
            if (excludes.includes('TeqFw_Web_Back_App_Server_Handler_Final'))
                throw new Error(`Handler 'TeqFw_Web_Back_App_Server_Handler_Final' cannot be excluded.`);
            for (const hName of Object.keys(includes)) {
                if (!excludes.includes(hName)) {
                    logger.info(`Create Web handler: ${hName}`);
                    /** @type {TeqFw_Web_Back_Dto_Plugin_Desc_Handler} */
                    const dto = includes[hName];
                    /** @type {TeqFw_Web_Back_Api_Dispatcher_IHandler} */
                    res[hName] = await container.get(`${hName}$`);
                    const orderDto = new DtoSort();
                    orderDto.id = hName;
                    orderDto.after = dto.after;
                    orderDto.before = dto.before;
                    utilSort.addItem(orderDto);
                } else {
                    logger.info(`Web handler '${hName}' is excluded and will not be created.`);
                }
            }
            // init result handlers
            logger.info(`Initialize web request handlers (total: ${Object.keys(res).length}).`);
            for (const hName of Object.keys(res)) {
                /** @type {TeqFw_Web_Back_Api_Dispatcher_IHandler} */
                const handler = res[hName];
                if (typeof handler.init === 'function') await handler.init();
            }
            return res;
        }

        // MAIN
        utilSort.reset();
        const handlers = await createHandlers(utilSort);
        const ordered = utilSort.getOrdered();
        const res = [];
        for (const ns of ordered)
            res.push(handlers[ns]);
        return res;
    }

    // MAIN
    Object.defineProperty(act, 'name', {value: `${NS}.act`});
    return act;
}
