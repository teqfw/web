/**
 * Action to scan for web requests handlers and to populate handlers registry.
 * @namespace TeqFw_Web_Back_App_Server_Scan_Handler
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_App_Server_Scan_Handler';

// MODULE'S FUNCTIONS
/**
 * @param {TeqFw_Di_Api_Container} container
 * @param {TeqFw_Web_Back_Defaults} DEF
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {TeqFw_Core_Back_Api_Plugin_Registry} modPlugins
 * @param {TeqFw_Web_Back_Plugin_Dto_Desc} dtoDesc
 * @param {typeof TeqFw_Core_Shared_Util_BeforeAfter} BeforeAfter -  Class
 * @param {typeof TeqFw_Core_Shared_Util_BeforeAfter.Dto} DtoSort
 */
export default function (
    {
        container,
        TeqFw_Web_Back_Defaults$: DEF,
        TeqFw_Core_Shared_Api_Logger$$: logger,
        TeqFw_Core_Back_Api_Plugin_Registry$: modPlugins,
        TeqFw_Web_Back_Plugin_Dto_Desc$: dtoDesc,
        'TeqFw_Core_Shared_Util_BeforeAfter.default': BeforeAfter,
        'TeqFw_Core_Shared_Util_BeforeAfter.Dto': DtoSort,
    }) {

    // FUNCS
    /**
     * @returns {Promise<*>}
     * @memberOf TeqFw_Web_Back_App_Server_Scan_Handler
     */
    async function act() {
        // FUNCS

        /**
         * Create handlers and populate sort util with before-after data.
         * @param utilSort
         * @returns {Promise<Object<string, TeqFw_Web_Back_Api_Dispatcher_IHandler>>}
         */
        async function createHandlers(utilSort) {
            const res = {};
            /** @type {Object<string, TeqFw_Web_Back_Plugin_Dto_Desc_Handler.Dto>} */
            const includes = {};
            const excludes = [];
            // scan plugins and get all handlers and excludes
            const plugins = modPlugins.items();
            for (const plugin of plugins) {
                /** @type {TeqFw_Web_Back_Plugin_Dto_Desc.Dto} */
                const desc = dtoDesc.createDto(plugin.teqfw[DEF.SHARED.NAME]);
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
                    logger.info(`Create web requests handler: ${hName}`);
                    /** @type {TeqFw_Web_Back_Plugin_Dto_Desc_Handler.Dto} */
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
        const sorter = new BeforeAfter();
        const handlers = await createHandlers(sorter);
        const ordered = sorter.getOrdered();
        const res = [];
        logger.info(`HTTP requests handlers (in order of processing):`);
        for (const ns of ordered) {
            res.push(handlers[ns]);
            logger.info(`\t${ns}`);
        }
        return res;
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
