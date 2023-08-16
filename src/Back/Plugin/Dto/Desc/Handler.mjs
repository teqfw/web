/**
 * DTO to describe web requests handler (events to listen and spaces to control).
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Plugin_Dto_Desc_Handler';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Back_Plugin_Dto_Desc_Handler
 */
class Dto {
    static namespace = NS;
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

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Back_Plugin_Dto_Desc_Handler {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castArrayOfStr|function} castArrayOfStr
     */
    constructor(
        {
            ['TeqFw_Core_Shared_Util_Cast.castArrayOfStr']: castArrayOfStr,
        }) {
        /**
         * @param {TeqFw_Web_Back_Plugin_Dto_Desc_Handler.Dto} [data]
         * @return {TeqFw_Web_Back_Plugin_Dto_Desc_Handler.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.after = castArrayOfStr(data?.after);
            res.before = castArrayOfStr(data?.before);
            res.spaces = castArrayOfStr(data?.spaces);
            return res;
        }
    }
}