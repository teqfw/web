/**
 * Web server handler to process requests to API.
 *
 * @namespace TeqFw_Web_Back_Handler_WAPI
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Handler_WAPI';
const {
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_HEADER_STATUS,
    HTTP2_METHOD_GET,
    HTTP2_METHOD_POST,
    HTTP_STATUS_OK,
} = H2;

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Back_Api_Request_INewHandler
 */
export default class TeqFw_Web_Back_Handler_WAPI {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Di_Shared_Container} */
        const container = spec['TeqFw_Di_Shared_Container$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];
        /** @type {TeqFw_Web_Back_Server_Respond.respond400|function} */
        const respond400 = spec['TeqFw_Web_Back_Server_Respond.respond400'];
        /** @type {TeqFw_Web_Back_Server_Respond.respond500|function} */
        const respond500 = spec['TeqFw_Web_Back_Server_Respond.respond500'];
        /** @type {TeqFw_Core_Back_Scan_Plugin_Registry} */
        const regPlugins = spec['TeqFw_Core_Back_Scan_Plugin_Registry$'];
        /** @type {TeqFw_Web_Back_Dto_Plugin_Desc.Factory} */
        const fDesc = spec['TeqFw_Web_Back_Dto_Plugin_Desc#Factory$'];
        /** @type {typeof TeqFw_Web_Back_Plugin_Web_Handler_Service_Item} */
        const Item = spec['TeqFw_Web_Back_Plugin_Web_Handler_Service_Item#'];
        /** @type {TeqFw_Web_Back_Model_Address} */
        const mAddress = spec['TeqFw_Web_Back_Model_Address$'];
        /** @type {TeqFw_Web_Back_Api_Service_Context.Factory} */
        const fContext = spec['TeqFw_Web_Back_Api_Service_Context#Factory$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {TeqFw_Web_Back_Plugin_Web_Handler_Service_Item[]} */
        const router = [];

        // DEFINE INNER FUNCTIONS
        /**
         * Process request if address space is equal to 'api'.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        async function process(req, res) {
            // DEFINE INNER FUNCTIONS

            /**
             * @param {TeqFw_Web_Back_Api_Request_IContext} context
             * @param {TeqFw_Web_Back_Api_Service_IRoute} factory
             */
            function composeInput(context, factory) {
                let res = {};
                const chunks = context.getInputData();
                const txt = Array.isArray(chunks) ? Buffer.concat(chunks).toString() : '';
                if (txt.length > 0) {
                    const parsed = JSON.parse(txt);
                    res = factory.createReq(parsed?.data);
                }
                return res;
            }

            /**
             * Match request to all routes and extract route params (if exist).
             *
             * @param {string} pathRoute route path of the URL (http://.../root/door/space[/route])
             * @return {{routeItem: TeqFw_Web_Back_Plugin_Web_Handler_Service_Item, params: {string, string}}}
             */
            function findRoute(pathRoute) {
                let routeItem, params = {};
                for (const item of router) {
                    const parts = item.regexp.exec(pathRoute);
                    if (parts) {
                        routeItem = item;
                        // params start from second position in 'parts' array
                        let i = 1;
                        for (const one of item.params) params[one] = parts[i++];
                    }
                }
                return {routeItem, params};
            }

            // MAIN FUNCTIONALITY
            if (!res.headersSent && !res[DEF.RES_STATUS]) {
                /** @type {TeqFw_Web_Back_Dto_Address} */
                const address = mAddress.parsePath(req.url);
                if (address?.space === DEF.SHARED.SPACE_API) {
                    // match address to route item and extract route params
                    const {
                        /** @type {TeqFw_Web_Back_Plugin_Web_Handler_Service_Item} */
                        routeItem, params
                    } = findRoute(address.route);
                    if (routeItem) { // call endpoint service
                        try {
                            // create service context object and put input data inside
                            const serviceCtx = fContext.create();
                            const json = req[DEF.REQ_BODY_JSON];
                            if (json) {
                                const inData = routeItem.routeFactory.createReq(json?.data);
                                serviceCtx.setInData(inData);
                            }
                            try {
                                // create output object for requested service
                                const outData = routeItem.routeFactory?.createRes();
                                serviceCtx.setOutData(outData);
                                // run service function
                                await routeItem.service(serviceCtx);
                                // compose result from outData been put into service context before service was run
                                res[DEF.RES_BODY] = JSON.stringify({data: outData});
                                // merge service out headers into response headers
                                const headersSrv = serviceCtx.getOutHeaders();
                                for (const key of Object.keys(headersSrv))
                                    res.setHeader(key, headersSrv[key]);
                                res.setHeader(HTTP2_HEADER_CONTENT_TYPE, 'application/json');
                                res[DEF.RES_STATUS] = HTTP_STATUS_OK;
                            } catch (err) {
                                logger.error(err);
                                respond500(res, err?.message);
                            }
                            debugger
                        } catch (err) {
                            logger.error(err);
                            respond400(req);
                        }
                    } // else - do nothing, final handler will report 404.
                }
            }
        }

        // DEFINE INSTANCE METHODS
        this.getProcessor = () => process;

        this.init = async function () {
            const items = regPlugins.items();
            for (const one of items) {
                const data = one.teqfw?.[DEF.SHARED.NAME];
                if (data) {
                    const desc = fDesc.create(data);
                    const services = desc.services;
                    if (services?.length) {
                        // const prefix = $path.join('/', realm);
                        for (const moduleId of services) {
                            /** @type {TeqFw_Web_Back_Api_Service_IFactory} */
                            const factory = await container.get(`${moduleId}$`);
                            const item = new Item(factory);
                            const route = item.route;
                            router.push(item);
                            logger.info(`    ${route} => ${moduleId}`);
                        }
                    }
                }
            }
        }

        this.requestIsMine = function ({method, address, headers} = {}) {
            return (
                (method === HTTP2_METHOD_GET) || (method === HTTP2_METHOD_POST)
                && (address?.space === DEF.SHARED.SPACE_API)
            );
        }

        // MAIN FUNCTIONALITY
        Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    }
}
