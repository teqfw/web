/**
 * DTO to describe order for handlers listeners in request processing queue.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Dto_Plugin_Desc_Handler_Event';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Dto_Plugin_Desc_Handler_Event {
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
}

// attributes names to use as aliases in queries to object props
TeqFw_Web_Back_Dto_Plugin_Desc_Handler_Event.AFTER = 'after';
TeqFw_Web_Back_Dto_Plugin_Desc_Handler_Event.BEFORE = 'before';

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Dto_Plugin_Desc_Handler_Event
 */
export class Factory {
    constructor(spec) {
        const {castArrayOfStr} = spec['TeqFw_Core_Shared_Util_Cast'];

        /**
         * @param {TeqFw_Web_Back_Dto_Plugin_Desc_Handler_Event|null} data
         * @return {TeqFw_Web_Back_Dto_Plugin_Desc_Handler_Event}
         */
        this.create = function (data = null) {
            const res = new TeqFw_Web_Back_Dto_Plugin_Desc_Handler_Event();
            res.after = castArrayOfStr(data?.after);
            res.before = castArrayOfStr(data?.before);
            return res;
        }
    }
}

// finalize code components for this es6-module
Object.freeze(TeqFw_Web_Back_Dto_Plugin_Desc_Handler_Event);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
