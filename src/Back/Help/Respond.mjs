import {constants as H2} from 'http2';

const {
    HTTP2_HEADER_ALLOW,
    HTTP_STATUS_OK,
    HTTP_STATUS_CREATED,
    HTTP_STATUS_NO_CONTENT,
    HTTP_STATUS_MOVED_PERMANENTLY,
    HTTP_STATUS_FOUND,
    HTTP_STATUS_SEE_OTHER,
    HTTP_STATUS_NOT_MODIFIED,
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_UNAUTHORIZED,
    HTTP_STATUS_FORBIDDEN,
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_METHOD_NOT_ALLOWED,
    HTTP_STATUS_CONFLICT,
    HTTP_STATUS_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_BAD_GATEWAY,
    HTTP_STATUS_SERVICE_UNAVAILABLE,
} = H2;

/**
 * Helper for sending HTTP responses with predefined status codes.
 */
export default class TeqFw_Web_Back_Help_Respond {
    /**
     * Sends an HTTP response with a given status code.
     *
     * @param {Object} params
     * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} params.res - HTTP response object.
     * @param {Object<string, string>} [params.headers={}] - Custom headers.
     * @param {string|Object} [params.body=''] - Response body.
     * @param {number} status - HTTP status code.
     * @returns {boolean} - `true` if response was sent, `false` if headers were already sent.
     */
    send({res, headers = {}, body = ''}, status) {
        if (res.headersSent) return false;
        res.writeHead(status, headers);
        res.end(typeof body === 'string' ? body : JSON.stringify(body));
        return true;
    }

    /** @see send */
    code200_Ok({res, headers = {}, body = ''}) {
        return this.send({res, headers, body}, HTTP_STATUS_OK);
    }

    /** @see send */
    code201_Created({res, headers = {}, body = ''}) {
        return this.send({res, headers, body}, HTTP_STATUS_CREATED);
    }

    /** @see send */
    code204_NoContent({res, headers = {}}) {
        return this.send({res, headers}, HTTP_STATUS_NO_CONTENT);
    }

    /** @see send */
    code301_MovedPermanently({res, headers = {}, body = ''}) {
        return this.send({res, headers, body}, HTTP_STATUS_MOVED_PERMANENTLY);
    }

    /** @see send */
    code302_Found({res, headers = {}, body = ''}) {
        return this.send({res, headers, body}, HTTP_STATUS_FOUND);
    }

    /** @see send */
    code303_SeeOther({res, headers = {}, body = ''}) {
        return this.send({res, headers, body}, HTTP_STATUS_SEE_OTHER);
    }

    /** @see send */
    code304_NotModified({res, headers = {}, body = ''}) {
        return this.send({res, headers, body}, HTTP_STATUS_NOT_MODIFIED);
    }

    /** @see send */
    code400_BadRequest({res, headers = {}, body = ''}) {
        return this.send({res, headers, body}, HTTP_STATUS_BAD_REQUEST);
    }

    /** @see send */
    code401_Unauthorized({res, headers = {}, body = ''}) {
        return this.send({res, headers, body}, HTTP_STATUS_UNAUTHORIZED);
    }

    /** @see send */
    code403_Forbidden({res, headers = {}, body = ''}) {
        return this.send({res, headers, body}, HTTP_STATUS_FORBIDDEN);
    }

    /** @see send */
    code404_NotFound({res, headers = {}, body = ''}) {
        return this.send({res, headers, body}, HTTP_STATUS_NOT_FOUND);
    }

    /** @see send */
    code405_MethodNotAllowed({res, headers = {}, body = ''}) {
        return this.send(
            {
                res,
                headers: {...headers, [HTTP2_HEADER_ALLOW]: 'HEAD, GET, POST'},
                body,
            },
            HTTP_STATUS_METHOD_NOT_ALLOWED
        );
    }

    /** @see send */
    code409_Conflict({res, headers = {}, body = ''}) {
        return this.send({res, headers, body}, HTTP_STATUS_CONFLICT);
    }

    /** @see send */
    code500_InternalServerError({res, headers = {}, body = ''}) {
        return this.send({res, headers, body}, HTTP_STATUS_INTERNAL_SERVER_ERROR);
    }

    /** @see send */
    code502_BadGateway({res, headers = {}, body = ''}) {
        return this.send({res, headers, body}, HTTP_STATUS_BAD_GATEWAY);
    }

    /** @see send */
    code503_ServiceUnavailable({res, headers = {}, body = ''}) {
        return this.send({res, headers, body}, HTTP_STATUS_SERVICE_UNAVAILABLE);
    }
}
