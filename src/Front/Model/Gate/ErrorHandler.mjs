/**
 * Default implementation for service gateway error handler.
 * @implements TeqFw_Web_Front_Api_Gate_IErrorHandler
 */
export default class TeqFw_Web_Front_Model_Gate_ErrorHandler {

    error(e) {
        const msg = e?.message ? e.message
            : (e) ? e : 'Unknown service gateway error.';
        console.log(msg);
    }
}
