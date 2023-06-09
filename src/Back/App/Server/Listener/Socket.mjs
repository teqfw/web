/**
 * Listener for web socket requests ('onUpgrade' events).
 *
 * @namespace TeqFw_Web_Back_App_Server_Listener_Socket
 */
export default class TeqFw_Web_Back_App_Server_Listener_Socket {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Back_App_Server_Listener_Socket_A_HndlFactory} */
        const aHndlFactory = spec['TeqFw_Web_Back_App_Server_Listener_Socket_A_HndlFactory$'];

        // VARS
        logger.setNamespace(this.constructor.name);
        /** @type {WebSocketServer} */
        let _wss;
        /** @type {TeqFw_Web_Back_Api_Listener_Socket[]} */
        const _handlers = [];

        // INSTANCE METHODS

        /**
         * Create listener for 'onUpgrade' events.
         * @param {WebSocketServer} wss
         * @returns {(function(*, *, *): void)|*}
         */
        this.createListener = function (wss) {
            // FUNCS
            /**
             * Listener for 'onUpgrade' events should select appropriate handler, prepare web-socket
             * using handler's method `prepareSocket` then pass web-socket to WebSocketServer.
             *
             * One only handler can process sockets.
             *
             * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
             * @param socket
             * @param head
             */
            function listener(req, socket, head) {
                const ipv6 = req.socket.remoteAddress;
                logger.info(`Web socket upgrade request is received from '${ipv6}'.`);

                _wss.handleUpgrade(req, socket, head, function done(ws) {
                    let socket = ws;
                    for (const handler of _handlers) {
                        if (handler.canProcess(req)) {
                            socket = (handler.prepareSocket) ? handler.prepareSocket(ws, req) : ws;
                            break;
                        }
                    }
                    _wss.emit('connection', socket, req);
                });

            }

            // MAIN
            _wss = wss;
            _wss.on('connection', (ws, req) => {
                /** @type {TeqFw_Web_Back_Api_Listener_Socket} */
                let handler;
                for (const one of _handlers) {
                    if (one.canProcess(req)) {
                        handler = one;
                        break;
                    }
                }
                if (handler) handler.process(ws, req);
                else {
                    // TODO: close socket
                }

            });
            logger.info(`Web socket listener is created for 'Upgrade' requests.`);

            return listener;
        };

        this.init = async function () {
            const created = await aHndlFactory.createHandlers();
            _handlers.push(...created);
        };
    }
}