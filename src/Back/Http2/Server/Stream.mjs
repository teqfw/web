/**
 * Handler to process HTTP/2 server stream.
 *
 * @namespace TeqFw_Web_Back_Http2_Server_Stream
 */
// MODULE'S IMPORT
import Http2, {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Http2_Server_Stream';

// MODULE'S CLASSES


// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the action.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @constructor
 * @memberOf TeqFw_Web_Back_Http2_Server_Stream
 */
function Factory(spec) {
    // EXTRACT DEPS
    /** @type {Function|TeqFw_Web_Back_Http2_Request_Processor.action} */
    const process = spec['TeqFw_Web_Back_Http2_Request_Processor$'];

    // PARSE INPUT & DEFINE WORKING VARS

    // DEFINE INNER FUNCTIONS
    /**
     * Function to process 'stream' events.
     *
     * @param {ServerHttp2Stream} stream
     * @param {Object<String, String>} headers
     * @param {Number} flags
     * @memberOf TeqFw_Web_Back_Http2_Server_Stream
     */
    async function action(stream, headers, flags) {
        // DEFINE INNER FUNCTIONS
        /**
         * Close stream on any error.
         *
         * @param {ServerHttp2Stream} stream
         * @param {Error} err
         */
        function respond500(stream, err) {
            const stack = (err.stack) ?? '';
            const message = err.message ?? 'Unknown error';
            const error = {message, stack};
            const str = JSON.stringify({error});
            console.error(str);
            if (stream.writable) {
                stream.respond({
                    [H2.HTTP2_HEADER_STATUS]: H2.HTTP_STATUS_INTERNAL_SERVER_ERROR,
                    [H2.HTTP2_HEADER_CONTENT_TYPE]: 'application/json'
                });
                stream.end(str);
            }
        }

        // MAIN FUNCTIONALITY
        try {
            // buffer to collect input data for POSTs
            const chunks = [];
            // collect input data into array of chunks (if exists)
            stream.on('data', (chunk) => chunks.push(chunk));
            // continue process after input has been read
            stream.on('end', () => process(stream, headers, flags, Buffer.concat(chunks).toString()));
            stream.on('error', (err) => respond500(stream, err));
        } catch (err) {
            respond500(stream, err);
        }
    }

    // MAIN FUNCTIONALITY

    // COMPOSE RESULT
    Object.defineProperty(action, 'name', {value: `${NS}.${action.name}`});
    return action;
}

// MODULE'S FUNCTIONALITY

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export {
    Factory as default,
};
