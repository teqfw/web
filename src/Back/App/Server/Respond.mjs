/**
 * Library with functions to respond using various HTTP status codes.
 * @namespace TeqFw_Web_Back_App_Server_Respond
 *
 * @deprecated
 * @see TeqFw_Web_Back_Help_Respond
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const {
    HTTP2_HEADER_ALLOW,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_HEADER_LOCATION,
    HTTP2_METHOD_GET,
    HTTP2_METHOD_HEAD,
    HTTP2_METHOD_POST,
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_CONFLICT,
    HTTP_STATUS_FORBIDDEN,
    HTTP_STATUS_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_METHOD_NOT_ALLOWED,
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_OK,
    HTTP_STATUS_SEE_OTHER,
    HTTP_STATUS_UNAUTHORIZED,
} = H2;

/**
 * @deprecated
 * @see TeqFw_Web_Back_Help_Respond
 */
export default class TeqFw_Web_Back_App_Server_Respond {
    /** @deprecated */
    status200(res, body, headers = {}) {
        if (!res.headersSent) {
            res.writeHead(HTTP_STATUS_OK, {...headers});
            res.end(body);
        }
    }

    /** @deprecated */
    status201(res, body, headers = {}) {
        if (!res.headersSent) {
            res.writeHead(HTTP_STATUS_OK, {...headers});
            res.end(body);
        }
    }

    /** @deprecated */
    status303(res, url) {
        if (!res.headersSent) {
            res.writeHead(HTTP_STATUS_SEE_OTHER, {
                [HTTP2_HEADER_LOCATION]: url,
            });
            res.end();
        }
    }

    /** @deprecated */
    status400(res, err) {
        if (!res.headersSent) {
            res.writeHead(HTTP_STATUS_BAD_REQUEST, {
                [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
            });
            if (typeof err === 'string') res.write(err);
            res.end();
        }
    }

    /** @deprecated */
    status401(res, err) {
        if (!res.headersSent) {
            res.writeHead(HTTP_STATUS_UNAUTHORIZED, {
                [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
            });
            if (typeof err === 'string') res.write(err);
            res.end();
        }
    }

    /** @deprecated */
    status403(res, err) {
        if (!res.headersSent) {
            res.writeHead(HTTP_STATUS_FORBIDDEN, {
                [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
            });
            res.write('Access to the resource is forbidden. ');
            if (typeof err === 'string') res.write(err);
            res.end();
        }
    }

    /** @deprecated */
    status404(res, err) {
        if (!res.headersSent) {
            res.writeHead(HTTP_STATUS_NOT_FOUND, {
                [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
            });
            res.write('Requested resource not found. ');
            if (typeof err === 'string') res.write(err);
            res.end();
        }
    }

    /** @deprecated */
    status405(res) {
        if (!res.headersSent) {
            const allowed = `${HTTP2_METHOD_HEAD}, ${HTTP2_METHOD_GET}, ${HTTP2_METHOD_POST}`;
            res.writeHead(HTTP_STATUS_METHOD_NOT_ALLOWED, {
                [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
                [HTTP2_HEADER_ALLOW]: allowed,
            });
            res.end(`Requested method is not allowed. Allowed methods: ${allowed}.`);
        }
    }

    /** @deprecated */
    status409(res, body, headers = {}) {
        if (!res.headersSent) {
            res.writeHead(HTTP_STATUS_CONFLICT, {...headers});
            res.end(body);
        }
    }

    /** @deprecated */
    status500(res, err) {
        if (!res.headersSent) {
            res.writeHead(HTTP_STATUS_INTERNAL_SERVER_ERROR, {
                [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
            });
            res.write('Internal server error. ');
            if (typeof err === 'string') res.write(err);
            res.end();
        }
    }

    // Deprecated methods for backward compatibility
    /**
     * @deprecated Use `status400` instead.
     */
    respond400(res) {
        this.status400(res);
    }

    /**
     * @deprecated Use `status403` instead.
     */
    respond403(res, err) {
        this.status403(res, err);
    }

    /**
     * @deprecated Use `status404` instead.
     */
    respond404(res, err) {
        this.status404(res, err);
    }

    /**
     * @deprecated Use `status405` instead.
     */
    respond405(res) {
        this.status405(res);
    }

    /**
     * @deprecated Use `status500` instead.
     */
    respond500(res, err) {
        this.status500(res, err);
    }
}

// Named exports for backward compatibility (deprecated)
// Create a single instance of the class for the module
const instance = new TeqFw_Web_Back_App_Server_Respond();

/**
 * @deprecated Use `TeqFw_Web_Back_App_Server_Respond#status400` instead.
 */
export function respond400(res) {
    instance.status400(res);
}

/**
 * @deprecated Use `TeqFw_Web_Back_App_Server_Respond#status403` instead.
 */
export function respond403(res, err) {
    instance.status403(res, err);
}

/**
 * @deprecated Use `TeqFw_Web_Back_App_Server_Respond#status404` instead.
 */
export function respond404(res, err) {
    instance.status404(res, err);
}

/**
 * @deprecated Use `TeqFw_Web_Back_App_Server_Respond#status405` instead.
 */
export function respond405(res) {
    instance.status405(res);
}

/**
 * @deprecated Use `TeqFw_Web_Back_App_Server_Respond#status500` instead.
 */
export function respond500(res, err) {
    instance.status500(res, err);
}
