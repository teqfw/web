/**
 * Factory to create new context for every HTTP1 request.
 * @namespace TeqFw_Web_Back_Server_Context_Factory
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Server_Context_Factory';

/**
 * TeqFW DI factory function to create dependencies for the object.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @return {function(): TeqFw_Web_Back_Api_Request_IContext}
 * @constructor
 */
export default function (spec) {
    // EXTRACT DEPS
    // DEFINE INNER FUNCTIONS
    /**
     *
     * @param {} req
     * @param {} res
     * @return {Promise<TeqFw_Web_Back_Api_Request_IContext>}
     * @memberOf TeqFw_Web_Back_Server_Context_Factory
     */
    async function create({req, res}) {
        /** @type {TeqFw_Web_Back_Api_Request_IContext} */
        const result = {};
        return result;
    }

    // MAIN FUNCTIONALITY
    Object.defineProperty(create, 'name', {value: `${NS}.create`});
    return create;
}
