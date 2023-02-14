/**
 * DTO to describe web socket handler.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Plugin_Dto_Desc_Socket';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Back_Plugin_Dto_Desc_Socket
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
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Back_Plugin_Dto_Desc_Socket {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castArrayOfStr|function} */
        const castArrayOfStr = spec['TeqFw_Core_Shared_Util_Cast.castArrayOfStr'];

        /**
         * @param {TeqFw_Web_Back_Plugin_Dto_Desc_Socket.Dto} [data]
         * @return {TeqFw_Web_Back_Plugin_Dto_Desc_Socket.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.after = castArrayOfStr(data?.after);
            res.before = castArrayOfStr(data?.before);
            return res;
        }
    }
}
