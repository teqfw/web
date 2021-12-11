/**
 * DTO for an item in registry for web requests handlers.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Scan_Handler_Listener';

/**
 * @memberOf TeqFw_Web_Back_Scan_Handler_Listener
 * @type {Object}
 */
const ATTR = {
    ACTION: 'action',
    AFTER: 'after',
    BEFORE: 'before',
    NS: 'ns',
};

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Back_Scan_Handler_Listener
 */
class Dto {
    static name = `${NS}.Dto`;
    /**
     * Function to process events.
     * @type {function}
     */
    action;
    /**
     * List of handlers (namespaces only) followed by this handler's listener:
     *   - [HandlerA, HandlerB]
     *   - ThisHandler
     * @type {string[]}
     */
    after;
    /**
     * List of handlers (namespaces only) that follow this handler's listener:
     *   - ThisHandler
     *   - [HandlerY, HandlerZ]
     * @type {string[]}
     */
    before;
    /**
     * Namespace for handler.
     * @type {string}
     */
    ns;
}

/**
 * @implements TeqFw_Core_Shared_Api_Dto_IMeta
 */
export default class TeqFw_Web_Back_Scan_Handler_Listener {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castArrayOfStr|function} */
        const castArrayOfStr = spec['TeqFw_Core_Shared_Util_Cast.castArrayOfStr'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castFunction|function} */
        const castFunction = spec['TeqFw_Core_Shared_Util_Cast.castFunction'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Back_Scan_Handler_Listener.Dto} data
         * @return {TeqFw_Web_Back_Scan_Handler_Listener.Dto}
         */
        this.createDto = function (data = null) {
            const res = new Dto();
            res.action = castFunction(data?.action);
            res.after = castArrayOfStr(data?.after);
            res.before = castArrayOfStr(data?.before);
            res.ns = castString(data.ns);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
