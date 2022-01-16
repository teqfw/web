/**
 * DTO to describe web requests handler (events to listen and spaces to control).
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Dto_Plugin_Desc_Handler';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Dto_Plugin_Desc_Handler {
    /**
     * List of handlers (namespaces only) followed by this handler's listener:
     *   - [HandlerA, HandlerB]
     *   - ThisHandler
     *
     * @type {string[]}
     */
    after;
    /**
     * List of handlers (namespaces only) that follow this handler's listener:
     *   - ThisHandler
     *   - [HandlerY, HandlerZ]
     *
     * @type {string[]}
     */
    before;
    /**
     * Names of the spaces in URLs that processed by this handler.
     * (@see TeqFw_Web_Back_Dto_Address)
     *
     * @type {string[]}
     */
    spaces;
}

// attributes names to use as aliases in queries to object props
TeqFw_Web_Back_Dto_Plugin_Desc_Handler.AFTER = 'after';
TeqFw_Web_Back_Dto_Plugin_Desc_Handler.BEFORE = 'before';
TeqFw_Web_Back_Dto_Plugin_Desc_Handler.SPACES = 'spaces';

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Dto_Plugin_Desc_Handler
 */
export class Factory {
    static namespace = NS;

    constructor(spec) {
        const {castArrayOfStr} = spec['TeqFw_Core_Shared_Util_Cast'];

        /**
         * @param {TeqFw_Web_Back_Dto_Plugin_Desc_Handler|null} data
         * @return {TeqFw_Web_Back_Dto_Plugin_Desc_Handler}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Dto_Plugin_Desc_Handler();
            res.after = castArrayOfStr(data?.after);
            res.before = castArrayOfStr(data?.before);
            res.spaces = castArrayOfStr(data?.spaces);
            return res;
        }
    }
}

// finalize code components for this es6-module
Object.freeze(TeqFw_Web_Back_Dto_Plugin_Desc_Handler);
