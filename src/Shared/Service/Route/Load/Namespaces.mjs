/**
 * Request and response to load DI namespaces to the front.
 *
 * @namespace TeqFw_Web_Shared_Service_Route_Load_Namespaces
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Service_Route_Load_Namespaces';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Service_Route_Load_Namespaces
 */
class Request {}

/**
 * @memberOf TeqFw_Web_Shared_Service_Route_Load_Namespaces
 */
class Response {
    /** @type {TeqFw_Web_Shared_Service_Dto_Namespace_Item[]} */
    items;
}

/**
 * Factory to create new DTOs.
 * @memberOf TeqFw_Web_Shared_Service_Route_Load_Namespaces
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {typeof TeqFw_Web_Shared_Service_Dto_Namespace_Item} */
        const DItem = spec['TeqFw_Web_Shared_Service_Dto_Namespace_Item#'];
        /** @type {TeqFw_Web_Shared_Service_Dto_Namespace_Item.Factory} */
        const fItem = spec['TeqFw_Web_Shared_Service_Dto_Namespace_Item#Factory$'];

        /**
         * @param {Request|Object|null} data
         * @return {TeqFw_Web_Shared_Service_Route_Load_Namespaces.Request}
         */
        this.createReq = function (data = null) {
            return new Request();
        }

        /**
         * @param {Response|Object|null} data
         * @return {TeqFw_Web_Shared_Service_Route_Load_Namespaces.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.items = Array.isArray(data?.items)
                ? data.items.map((one) => (one instanceof DItem) ? one : fItem.create(one))
                : [];
            return res;
        }
    }
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
Object.defineProperty(Request, 'name', {value: `${NS}.${Request.constructor.name}`});
Object.defineProperty(Response, 'name', {value: `${NS}.${Response.constructor.name}`});
export {
    Factory,
    Request,
    Response,
};
