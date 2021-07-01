/**
 * Web request handler for API services used in HTTP/1 server processor.
 *
 * @namespace TeqFw_Web_Plugin_Web_Handler_Service
 */
// MODULE'S IMPORT
import $path from 'path';
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Plugin_Web_Handler_Service';

// MODULE'S CLASSES


// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create handler to process requests to API services.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @return {function(TeqFw_Web_Back_Api_Request_IContext): Promise<void>}
 * @constructor
 * @memberOf TeqFw_Web_Plugin_Web_Handler_Service
 */
async function Factory(spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Web_Defaults} */
    const DEF = spec['TeqFw_Web_Defaults$'];
    /** @type {TeqFw_Di_Container} */
    const container = spec['TeqFw_Di_Container$'];
    /** @type {TeqFw_Core_Logger} */
    const logger = spec['TeqFw_Core_Logger$'];
    /** @type {TeqFw_Core_Back_Scan_Plugin_Registry} */
    const regPlugin = spec['TeqFw_Core_Back_Scan_Plugin_Registry$'];
    /** @type {TeqFw_Web_Back_Model_Address} */
    const mAddress = spec['TeqFw_Web_Back_Model_Address$'];
    /** @type {TeqFw_Web_Back_Api_Dto_Plugin_Desc.Factory} */
    const fDesc = spec['TeqFw_Web_Back_Api_Dto_Plugin_Desc#Factory$'];
    /** @type {TeqFw_Web_Plugin_Web_Handler_Service_Dto_Item.Factory} */
    const fItem = spec['TeqFw_Web_Plugin_Web_Handler_Service_Dto_Item#Factory$'];
    /** @type {TeqFw_Web_Back_Api_Service_IContext.Factory} */
    const fContext = spec['TeqFw_Web_Back_Api_Service_IContext#Factory$'];

    // PARSE INPUT & DEFINE WORKING VARS
    /** @type {Object<string, TeqFw_Web_Plugin_Web_Handler_Service_Dto_Item>} */
    const router = {};

    // DEFINE INNER FUNCTIONS
    /**
     * Process plugins descriptions, create services and setup API routing.
     */
    async function initHandler() {
        const items = regPlugin.items();
        for (const one of items) {
            const data = one.teqfw?.[DEF.REALM];
            if (data) {
                const desc = fDesc.create(data);
                const realm = desc.api.realm;
                const services = desc.api.services;
                if (realm && services?.length) {
                    const prefix = $path.join('/', realm);
                    for (const moduleId of services) {
                        /** @type {TeqFw_Web_Back_Api_Service_IFactory} */
                        const factory = await container.get(`${moduleId}$`);
                        const item = fItem.create();
                        item.dtoFactory = factory.getDtoFactory();
                        item.service = factory.getService();
                        const tail = factory.getRoute();
                        const route = $path.join(prefix, tail);
                        router[route] = item;
                        logger.debug(`    ${route} => ${moduleId}`);
                    }
                }
            }
        }
    }

    /**
     * Handler to process API requests.
     *
     * @param {TeqFw_Web_Back_Api_Request_IContext} context
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Plugin_Web_Handler_Service
     */
    async function handle(context) {
        // DEFINE INNER FUNCTIONS

        /**
         *
         * @param {TeqFw_Web_Back_Api_Request_IContext} context
         * @param {TeqFw_Web_Back_Api_Service_Factory_IReqRes} factory
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

        // MAIN FUNCTIONALITY
        /** @type {TeqFw_Web_Back_Http1_Request_Context} */
        const ctx = context; // IDEA is failed with context help (suggestions on Ctrl+Space)
        if (!ctx.isRequestProcessed()) {
            // process only unprocessed requests
            const path = ctx.getPath();
            const address = mAddress.parsePath(path);
            if (address.space === DEF.SPACE.API) {
                // simple matching for routes is here
                if (router[address.route]) {
                    // get service data and create service context object
                    const serviceDesc = router[address.route];
                    const serviceCtx = fContext.create();
                    serviceCtx.setRequestContext(context);
                    // parse request input and put in to service context
                    // const chunks = ctx.getInputData();
                    // const txt = Array.isArray(chunks) ? Buffer.concat(chunks).toString() : '';
                    // const parsed = JSON.parse(txt);
                    // const inData = serviceDesc.dtoFactory?.createReq(parsed?.data);
                    try {
                        const inData = composeInput(context, serviceDesc.dtoFactory);
                        serviceCtx.setInData(inData);
                        // create output object for requested service
                        const outData = serviceDesc.dtoFactory?.createRes();
                        serviceCtx.setOutData(outData);
                        // run service function
                        await serviceDesc.service(serviceCtx);
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
                        ctx.setResponseHeader(DEF.HTTP.HEADER.STATUS, H2.HTTP_STATUS_BAD_REQUEST);
                        ctx.setResponseBody(e.message);
                        ctx.markRequestProcessed();
                    }
                }
            }
        }
    }

    // MAIN FUNCTIONALITY
    logger.debug('Create API services handler for web requests.');
    await initHandler();

    // COMPOSE RESULT
    Object.defineProperty(handle, 'name', {value: `${NS}.${handle.name}`});
    return handle;
}

// IDEA re-formats 'export' code wrong if code has errors:
// export default async
// function Factory {...}
export default Factory;
