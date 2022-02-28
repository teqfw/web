/**
 * Library with functions to respond using various HTTP status codes.
 * @namespace TeqFw_Web_Back_App_Server_Respond
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_App_Server_Respond';
const {
    HTTP2_HEADER_ALLOW,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_METHOD_GET,
    HTTP2_METHOD_HEAD,
    HTTP2_METHOD_POST,
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_METHOD_NOT_ALLOWED,
    HTTP_STATUS_NOT_FOUND,
} = H2;

/**
 * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
 * @memberOf TeqFw_Web_Back_App_Server_Respond
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
 * @memberOf TeqFw_Web_Back_App_Server_Respond
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
 * Respond
 * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
 * @memberOf TeqFw_Web_Back_App_Server_Respond
 */
function respond405(res) {
    if (!res.headersSent) {
        const allowed = `${HTTP2_METHOD_HEAD}, ${HTTP2_METHOD_GET}, ${HTTP2_METHOD_POST}`;
        res.writeHead(HTTP_STATUS_METHOD_NOT_ALLOWED, {
            [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
            [HTTP2_HEADER_ALLOW]: allowed,
        });
        res.end(`Requested method is not allowed. Allowed methods: ${allowed}.`);
    }
}

/**
 * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
 * @param {string} err
 * @memberOf TeqFw_Web_Back_App_Server_Respond
 */
function respond500(res, err) {
    if (!res.headersSent) {
        res.writeHead(HTTP_STATUS_INTERNAL_SERVER_ERROR, {
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
Object.defineProperty(respond405, 'name', {value: `${NS}.${respond405.name}`});
Object.defineProperty(respond500, 'name', {value: `${NS}.${respond500.name}`});


export {
    respond400,
    respond404,
    respond405,
    respond500,
}
