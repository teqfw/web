/**
 * Load DI namespaces to the front.
 *
 * @namespace TeqFw_Web_Back_Service_Load_Namespaces
 */
// MODULE'S IMPORT
import $path from 'path';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Service_Load_Namespaces';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class TeqFw_Web_Back_Service_Load_Namespaces {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {typeof TeqFw_Core_Back_Api_Dto_Plugin_Desc} */
        const DescCore = spec['TeqFw_Core_Back_Api_Dto_Plugin_Desc#'];
        /** @type {TeqFw_Core_Back_Scan_Plugin_Registry} */
        const registry = spec['TeqFw_Core_Back_Scan_Plugin_Registry$'];
        /** @type {TeqFw_Web_Shared_Service_Route_Load_Namespaces.Factory} */
        const fRoute = spec['TeqFw_Web_Shared_Service_Route_Load_Namespaces#Factory$'];
        /** @type {TeqFw_Web_Shared_Service_Dto_Namespace_Item.Factory} */
        const fItem = spec['TeqFw_Web_Shared_Service_Dto_Namespace_Item#Factory$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {TeqFw_Web_Shared_Service_Dto_Namespace_Item[]} */
        const namespaces = getNamespaces(registry); // cache for namespaces

        // DEFINE INNER FUNCTIONS
        /**
         * Loop through all plugins and compose namespace mapping for static sources.
         * (@see TeqFw_Web_Plugin_Web_Handler_Static)
         *
         * @param {TeqFw_Core_Back_Scan_Plugin_Registry} registry
         * @return {TeqFw_Web_Shared_Service_Dto_Namespace_Item[]}
         */
        function getNamespaces(registry) {
            const result = [];
            const plugins = registry.items();
            for (const one of plugins) {
                /** @type {TeqFw_Core_Back_Api_Dto_Plugin_Desc_Autoload} */
                const auto = one.teqfw[DescCore.AUTOLOAD];
                const item = fItem.create();
                item.ext = auto.ext;
                item.ns = auto.ns;
                item.path = $path.join('/', DEF.SHARED.SPACE.SRC, one.name);
                result.push(item);
            }
            return result;
        }

        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => fRoute;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             *
             * @param {TeqFw_Web_Back_Api_Service_IContext} context
             */
            async function service(context) {
                /** @type {TeqFw_Web_Shared_Service_Route_Load_Namespaces.Response} */
                const out = context.getOutData();
                out.items = namespaces;
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        }
    }

}
