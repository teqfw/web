/**
 * DTO to represent plugin descriptor (teqfw.json) structure
 * that is related to 'web/handlers' node:
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler';

// MODULE'S CLASSES
class TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler {
    /**
     * List of handlers (namespaces only) followed by this handler:
     *   - ["Vendor1_Module1_Plugin_Http2_Handler", "Vendor2_Module2_Plugin_Http2_Handler"]
     *   - ThisHandler
     *
     * TODO: this approach is more complex then with 'weight' option but is more flexible.
     *
     * @type {string[]}
     */
    after;
    /**
     * List of handlers (namespaces only) that follow this handler:
     *   - ThisHandler
     *   - ["Vendor1_Module1_Plugin_Http2_Handler", "Vendor2_Module2_Plugin_Http2_Handler"]
     *
     * TODO: this approach is more complex then with 'weight' option but is more flexible.
     *
     * @type {string[]}
     */
    before;
    /**
     * Dependency ID for handler factory's module to create handler: "Fl32_Ap_User_Plugin_Web_Handler_Session".
     *
     *  @type {string}
     */
    factoryId;
    /**
     * Weight of the handler in the list of all handlers (more weight means closer to the beginning of the list).
     * This is temporary approach for quick organizing of the requests handlers. before/after options are more
     * flexible but is more complex.
     *
     * @type {number}
     * @deprecated
     */
    weight;
}

// attributes names to use as aliases in queries to object props
TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler.AFTER = 'after';
TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler.BEFORE = 'before';
TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler.FACTORY_ID = 'factoryId';
TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler.WEIGHT = 'weight';

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler
 */
class Factory {
    constructor() {
        /**
         * @param {TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler|null} data
         * @return {TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler();
            res.after = Array.isArray(data?.after) ? data.after : [];
            res.before = Array.isArray(data?.before) ? data.before : [];
            res.factoryId = data?.factoryId;
            res.weight = data?.weight ?? 0;
            return res;
        }
    }
}

// freeze class to deny attributes changes then export class
Object.freeze(TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export {
    TeqFw_Web_Back_Api_Dto_Plugin_Desc_Handler as default,
    Factory
} ;
