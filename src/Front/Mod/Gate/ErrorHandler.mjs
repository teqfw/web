/**
 * Default implementation for service gateway error handler.
 * @implements TeqFw_Web_Front_Api_Gate_IErrorHandler
 * @deprecated we should use events here
 */
export default class TeqFw_Web_Front_Mod_Gate_ErrorHandler {

    error(e) {
        const msg = e?.message ? e.message
            : (e) ? e : 'Unknown service gateway error.';
        console.log(msg);
    }
}
