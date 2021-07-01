/**
 * Route data for service to load DI namespaces to the front.
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
 * @implements TeqFw_Web_Back_Api_Service_Factory_IRoute
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Shared_Defaults} */
        const DEF = spec['TeqFw_Web_Shared_Defaults$'];
        /** @type {typeof TeqFw_Web_Shared_Service_Dto_Namespace_Item} */
        const DItem = spec['TeqFw_Web_Shared_Service_Dto_Namespace_Item#'];
        /** @type {TeqFw_Web_Shared_Service_Dto_Namespace_Item.Factory} */
        const fItem = spec['TeqFw_Web_Shared_Service_Dto_Namespace_Item#Factory$'];

        // DEFINE INSTANCE METHODS
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

        this.getRoute = () => `/${DEF.NAME}${DEF.SRV.LOAD.NAMESPACES}`;
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
