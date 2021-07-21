/**
 * Web request handler for API services.
 *
 * @namespace TeqFw_Web_Back_Plugin_Web_Handler_Service
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Plugin_Web_Handler_Service';

// MODULE'S CLASSES
/**
 * Factory to setup execution context and to create handler.
 *
 * @implements TeqFw_Web_Back_Api_Request_IHandler.Factory
 * @memberOf TeqFw_Web_Back_Plugin_Web_Handler_Service
 */
export default class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {TeqFw_Di_Shared_Container} */
        const container = spec['TeqFw_Di_Shared_Container$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Core_Back_Scan_Plugin_Registry} */
        const regPlugin = spec['TeqFw_Core_Back_Scan_Plugin_Registry$'];
        /** @type {TeqFw_Web_Back_Model_Address} */
        const mAddress = spec['TeqFw_Web_Back_Model_Address$'];
        /** @type {TeqFw_Web_Back_Api_Dto_Plugin_Desc.Factory} */
        const fDesc = spec['TeqFw_Web_Back_Api_Dto_Plugin_Desc#Factory$'];
        /** @type {typeof TeqFw_Web_Back_Plugin_Web_Handler_Service_Item} */
        const Item = spec['TeqFw_Web_Back_Plugin_Web_Handler_Service_Item#'];
        /** @type {TeqFw_Web_Back_Api_Service_Context.Factory} */
        const fContext = spec['TeqFw_Web_Back_Api_Service_Context#Factory$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {TeqFw_Web_Back_Plugin_Web_Handler_Service_Item[]} */
        const router = [];

        // DEFINE INSTANCE METHODS

        this.create = async function () {

            // DEFINE INNER FUNCTIONS
            /**
             * Handler to process API requests.
             *
             * @param {TeqFw_Web_Back_Api_Request_IContext} context
             * @returns {Promise<void>}
             * @memberOf TeqFw_Web_Back_Plugin_Web_Handler_Service
             */
            async function handle(context) {
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
                /** @type {TeqFw_Web_Back_Server_Request_Context} */
                const ctx = context; // IDEA is failed with context help (suggestions on Ctrl+Space)
                if (!ctx.isRequestProcessed()) {
                    // process only unprocessed requests
                    const path = ctx.getPath();
                    const address = mAddress.parsePath(path);
                    if (address.space === DEF.SHARED.SPACE_API) {
                        // match address to route item and extract route params
                        const {routeItem, params} = findRoute(address.route);
                        if (routeItem) {
                            // get service data and create service context object
                            const serviceCtx = fContext.create();
                            serviceCtx.setRequestContext(context);
                            serviceCtx.setRouteParams(params);

                            // parse request input and put in to service context
                            try {
                                const inData = composeInput(context, routeItem.routeFactory);
                                serviceCtx.setInData(inData);
                                try {
                                    // create output object for requested service
                                    const outData = routeItem.routeFactory?.createRes();
                                    serviceCtx.setOutData(outData);
                                    // run service function
                                    await routeItem.service(serviceCtx);
                                    // compose result from outData been put into service context before service was run
                                    const outTxt = JSON.stringify({data: outData});
                                    ctx.setResponseBody(outTxt);
                                    // merge service out headers into response headers
                                    const headersSrv = serviceCtx.getOutHeaders();
                                    for (const key of Object.keys(headersSrv))
                                        ctx.setResponseHeader(key, headersSrv[key]);
                                    const headersRes = ctx.getResponseHeaders();
                                    if (!headersRes[H2.HTTP2_HEADER_CONTENT_TYPE]) {
                                        ctx.setResponseHeader(H2.HTTP2_HEADER_CONTENT_TYPE, 'application/json');
                                    }
                                    ctx.markRequestProcessed();
                                } catch (e) {
                                    ctx.setResponseHeader(DEF.HTTP_HEADER_STATUS, H2.HTTP_STATUS_INTERNAL_SERVER_ERROR);
                                    ctx.setResponseBody(e.message);
                                    ctx.markRequestProcessed();
                                }
                            } catch (e) {
                                ctx.setResponseHeader(DEF.HTTP_HEADER_STATUS, H2.HTTP_STATUS_BAD_REQUEST);
                                ctx.setResponseBody(e.message);
                                ctx.markRequestProcessed();
                            }
                        }
                    }
                }
            }

            /**
             * Process plugins descriptions, create services and setup API routing.
             */
            async function initHandler() {
                const items = regPlugin.items();
                for (const one of items) {
                    const data = one.teqfw?.[DEF.DESC_NODE];
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

            // MAIN FUNCTIONALITY
            logger.info('Create API services handler for web requests.');
            await initHandler();

            // COMPOSE RESULT
            Object.defineProperty(handle, 'name', {value: `${NS}.${handle.name}`});
            return handle;
        }
    }
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
