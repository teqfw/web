// @ts-check

/**
 * @namespace TeqFw_Web_Back_Helper_Respond
 * @description HTTP response helper.
 */
export default class Respond {
    /**
     * @param {object} deps
     * @param {typeof import("node:http2")} deps.http2
     */
    constructor({http2}) {
        // VARS
        const {constants: H2} = http2;
        const {
            HTTP2_HEADER_ALLOW,
            HTTP_STATUS_BAD_GATEWAY,
            HTTP_STATUS_BAD_REQUEST,
            HTTP_STATUS_CONFLICT,
            HTTP_STATUS_CREATED,
            HTTP_STATUS_FORBIDDEN,
            HTTP_STATUS_FOUND,
            HTTP_STATUS_INTERNAL_SERVER_ERROR,
            HTTP_STATUS_METHOD_NOT_ALLOWED,
            HTTP_STATUS_MOVED_PERMANENTLY,
            HTTP_STATUS_NOT_FOUND,
            HTTP_STATUS_NOT_MODIFIED,
            HTTP_STATUS_NO_CONTENT,
            HTTP_STATUS_OK,
            HTTP_STATUS_PAYMENT_REQUIRED,
            HTTP_STATUS_SEE_OTHER,
            HTTP_STATUS_SERVICE_UNAVAILABLE,
            HTTP_STATUS_UNAUTHORIZED,
        } = H2;

        // FUNC
        /**
         * Sends an HTTP response with a given status code.
         *
         * @param {object} deps - HTTP response payload.
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @param {number} status - HTTP status code.
         * @returns {boolean} - `true` if response was sent, `false` if headers were already sent.
         */
        function send({res, headers = {}, body = ''}, status) {
            if (res.headersSent || res.writableEnded) return false;
            /** @type {TeqFw_Web_Back_Response_Target & {writeHead(status: number, headers?: TeqFw_Web_Back_Response_Headers): void}} */
            const target = /** @type {*} */ (res);
            target.writeHead(status, headers);
            res.end(typeof body === 'string' ? body : JSON.stringify(body));
            return true;
        }

        // MAIN

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @returns {boolean}
         */
        this.code200_Ok = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_OK);
        };

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @returns {boolean}
         */
        this.code201_Created = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_CREATED);
        };

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @returns {boolean}
         */
        this.code204_NoContent = function ({res, headers = {}}) {
            return send({res, headers}, HTTP_STATUS_NO_CONTENT);
        };

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @returns {boolean}
         */
        this.code301_MovedPermanently = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_MOVED_PERMANENTLY);
        };

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @returns {boolean}
         */
        this.code302_Found = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_FOUND);
        };

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @returns {boolean}
         */
        this.code303_SeeOther = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_SEE_OTHER);
        };

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @returns {boolean}
         */
        this.code304_NotModified = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_NOT_MODIFIED);
        };

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @returns {boolean}
         */
        this.code400_BadRequest = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_BAD_REQUEST);
        };

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @returns {boolean}
         */
        this.code401_Unauthorized = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_UNAUTHORIZED);
        };

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @returns {boolean}
         */
        this.code402_PaymentRequired = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_PAYMENT_REQUIRED);
        };

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @returns {boolean}
         */
        this.code403_Forbidden = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_FORBIDDEN);
        };

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @returns {boolean}
         */
        this.code404_NotFound = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_NOT_FOUND);
        };

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @param {string} [deps.allowed]
         * @returns {boolean}
         */
        this.code405_MethodNotAllowed = function ({res, headers = {}, body = '', allowed = 'HEAD, GET, POST'}) {
            return send(
                {
                    res,
                    headers: {...headers, [HTTP2_HEADER_ALLOW]: allowed},
                    body,
                },
                HTTP_STATUS_METHOD_NOT_ALLOWED
            );
        };

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @returns {boolean}
         */
        this.code409_Conflict = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_CONFLICT);
        };

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @returns {boolean}
         */
        this.code500_InternalServerError = function ({res, headers = {}, body = 'Internal Server Error'}) {
            return send({res, headers, body}, HTTP_STATUS_INTERNAL_SERVER_ERROR);
        };

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @returns {boolean}
         */
        this.code502_BadGateway = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_BAD_GATEWAY);
        };

        /**
         * @param {object} deps
         * @param {TeqFw_Web_Back_Response_Target} deps.res
         * @param {TeqFw_Web_Back_Response_Headers} [deps.headers]
         * @param {TeqFw_Web_Back_Response_Body} [deps.body]
         * @returns {boolean}
         */
        this.code503_ServiceUnavailable = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_SERVICE_UNAVAILABLE);
        };

        /**
         * Checks if the response is writable and not yet sent.
         * @param {TeqFw_Web_Back_Response_Target} res
         * @returns {boolean}
         */
        this.isWritable = function (res) {
            return !res.headersSent && !res.writableEnded;
        };
    }
}

/**
 * Dependencies for the response helper.
 */
export const __deps__ = Object.freeze({
    default: {
        http2: 'node:http2',
    },
});
