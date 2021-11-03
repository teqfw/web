/**
 * Handler to process HTTP/1 'connection' events.
 * (@see https://nodejs.org/api/http.html#event-connection)
 *
 * @namespace TeqFw_Web_Back_Server_Event_Connection
 */
// MODULE'S IMPORT

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Server_Event_Connection';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to create dependencies for the object.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @return {TeqFw_Web_Back_Server_Event_Connection.handle|function}
 * @constructor
 */
export default function (spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Web_Back_Defaults} */
    const DEF = spec['TeqFw_Web_Back_Defaults$'];


    // DEFINE INNER FUNCTIONS
    /**
     * @param {stream.Duplex} socket
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Back_Server_Event_Connection
     */
    async function handle(socket) {
        // DEFINE INNER FUNCTIONS


        // MAIN FUNCTIONALITY
        const id = JSON.stringify(socket.address());
        socket.on('close', (hadError) => console.log(`SOCK: socket close ${hadError} (${id})`));
        socket.on('connect', () => console.log(`SOCK: connect (${id})`));
        socket.on('data', (data) => console.log(`SOCK: data (${id})` + JSON.stringify(data)));
        socket.on('drain', () => console.log(`SOCK: drain (${id}) ()`));
        socket.on('end', () => console.log(`SOCK: end (${id})`));
        socket.on('error', (error) => console.log(`SOCK: error (${id})`));
        socket.on('lookup', (err, address, family, host) => console.log(`SOCK: lookup (${id})`));
        socket.on('ready', () => console.log(`SOCK: ready (${id})`));
        socket.on('timeout', () => console.log(`SOCK: timeout (${id})`));
    }

    // COMPOSE RESULT
    Object.defineProperty(handle, 'name', {value: `${NS}.handle`});
    return handle;
}
