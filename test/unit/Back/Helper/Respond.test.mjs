import {describe, test, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_Helper_Respond from '../../../../src/Back/Helper/Respond.mjs';

/** Minimal HTTP/2 constants mock */
const mockHttp2 = {
    constants: {
        HTTP2_HEADER_ALLOW: 'allow',
        HTTP_STATUS_OK: 200,
        HTTP_STATUS_CREATED: 201,
        HTTP_STATUS_NO_CONTENT: 204,
        HTTP_STATUS_MOVED_PERMANENTLY: 301,
        HTTP_STATUS_FOUND: 302,
        HTTP_STATUS_SEE_OTHER: 303,
        HTTP_STATUS_NOT_MODIFIED: 304,
        HTTP_STATUS_BAD_REQUEST: 400,
        HTTP_STATUS_UNAUTHORIZED: 401,
        HTTP_STATUS_PAYMENT_REQUIRED: 402,
        HTTP_STATUS_FORBIDDEN: 403,
        HTTP_STATUS_NOT_FOUND: 404,
        HTTP_STATUS_METHOD_NOT_ALLOWED: 405,
        HTTP_STATUS_CONFLICT: 409,
        HTTP_STATUS_INTERNAL_SERVER_ERROR: 500,
        HTTP_STATUS_BAD_GATEWAY: 502,
        HTTP_STATUS_SERVICE_UNAVAILABLE: 503,
    }
};

class MockRes {
    constructor() {
        this.statusCode = undefined;
        this.headers = undefined;
        this.body = undefined;
        this.headersSent = false;
        this.writableEnded = false;
    }

    writeHead(/** @type {number} */ status, /** @type {TeqFw_Web_Back_Response_Headers|undefined} */ headers) {
        this.statusCode = status;
        this.headers = headers;
        this.headersSent = true;
    }

    end(chunk = '') {
        this.body = chunk;
        this.writableEnded = true;
    }
}

describe('TeqFw_Web_Back_Helper_Respond', () => {
    /** @type {TeqFw_Web_Back_Helper_Respond} */
    let respond;

    beforeEach(() => {
        /** @type {TeqFw_Web_Back_Helper_Respond} */
        respond = new TeqFw_Web_Back_Helper_Respond({http2: /** @type {*} */ (mockHttp2)});
    });

    test('sends 200 OK response', () => {
        const res = /** @type {*} */ (new MockRes());
        const ok = respond.code200_Ok({res, headers: {a: 'b'}, body: 'hi'});
        assert.strictEqual(ok, true);
        assert.strictEqual(res.statusCode, 200);
        assert.deepStrictEqual(res.headers, {a: 'b'});
        assert.strictEqual(res.body, 'hi');
    });

    test('adds Allow header for 405 Method Not Allowed', () => {
        const res = /** @type {*} */ (new MockRes());
        respond.code405_MethodNotAllowed({res});
        assert.strictEqual(res.statusCode, 405);
        assert.strictEqual(res.headers.allow, 'HEAD, GET, POST');
    });

    test('isWritable detects ended responses', () => {
        const res = /** @type {*} */ (new MockRes());
        respond.code200_Ok({res});
        assert.strictEqual(respond.isWritable(res), false);
        const again = respond.code200_Ok({res});
        assert.strictEqual(again, false);
    });
});
