/**
 * Web server handler to final processing of the requests (HTTP status 404).
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Handler_Final';

/**
 * @implements TeqFw_Web_Back_Api_Request_INewHandler
 */
export default class TeqFw_Web_Back_Handler_Final {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Server_Respond.respond404|function} */
        const respond404 = spec['TeqFw_Web_Back_Server_Respond.respond404'];

        // DEFINE INNER FUNCTIONS

        /**
         * Send 'Error 404' if response is not handled yet.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        function process(req, res) {
            if (!res.headersSent) respond404(res);
        }

        // DEFINE INSTANCE METHODS
        this.getProcessor = () => process;

        this.init = async function () {}

        this.requestIsMine = function ({method, address, headers} = {}) {
            return true;
        }

        // MAIN FUNCTIONALITY
        Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    }
}
