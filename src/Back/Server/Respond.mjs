/**
 * Library with functions to respond using various HTTP status codes.
 * @namespace TeqFw_Web_Back_Server_Respond
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';
import {castArray} from "@teqfw/core/src/Shared/Util/Cast.mjs";

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Server_Respond';
const {
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_NOT_FOUND,
} = H2;

/**
 * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
 * @memberOf TeqFw_Web_Back_Server_Respond
 */
function respond400(res) {
    if (!res.headersSent) {
        res.writeHead(HTTP_STATUS_BAD_REQUEST, {
            [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
        });
        res.end('Malformed request syntax.');
    }
}

/**
 * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
 * @memberOf TeqFw_Web_Back_Server_Respond
 */
function respond404(res) {
    if (!res.headersSent) {
        res.writeHead(HTTP_STATUS_NOT_FOUND, {
            [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
        });
        res.end('Requested resource is not found.');
    }
}

/**
 * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
 * @param {string} err
 * @memberOf TeqFw_Web_Back_Server_Respond
 */
function respond500(res, err) {
    if (!res.headersSent) {
        res.writeHead(HTTP_STATUS_NOT_FOUND, {
            [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
        });
        res.write('Internal server error.');
        if (typeof err === 'string') res.write(err);
        res.end();
    }
}


// MODULE'S FUNCTIONALITY
// finalize code components for this es6-module
Object.defineProperty(respond400, 'name', {value: `${NS}.${respond400.name}`});
Object.defineProperty(respond404, 'name', {value: `${NS}.${respond404.name}`});
Object.defineProperty(respond500, 'name', {value: `${NS}.${respond500.name}`});


export {
    respond400,
    respond404,
    respond500,
}
