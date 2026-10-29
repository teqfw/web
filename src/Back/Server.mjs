// @ts-check

/**
 * @namespace TeqFw_Web_Back_Server
 * @description Owns the native transport and its single-start lifetime.
 */
export default class Server {
    /**
     * @param {object} deps
     * @param {typeof import('node:http')} deps.http
     * @param {typeof import('node:http2')} deps.http2
     * @param {TeqFw_Web_Back_Config_Runtime} deps.config
     * @param {TeqFw_Log_Provider} deps.logger
     * @param {TeqFw_Web_Back_PipelineEngine} deps.pipelineEngine
     * @param {TeqFw_Web_Back_Enum_Server_Type} deps.SERVER_TYPE
     * @param {TeqFw_Web_Back_ServerLifecycle__Controller} deps.lifecycle
     */
    constructor({http, http2, config, logger, pipelineEngine, SERVER_TYPE, lifecycle}) {
        const log = logger.forSource('TeqFw_Web_Back_Server');
        /** @type {import('node:http').Server|import('node:http2').Http2Server|import('node:http2').Http2SecureServer|undefined} */
        let instance;
        /** @type {'new'|'starting'|'running'|'stopping'|'stopped'|'failed'} */
        let state = 'new';
        /** @type {Set<import('node:net').Socket>} */
        const sockets = new Set();
        /** @type {Set<import('node:http2').ServerHttp2Session>} */
        const sessions = new Set();
        /** @type {Promise<void>|undefined} */
        let stopping;
        /** @type {(() => void)|undefined} */
        let cancelStart;
        let timeout = 5000;

        /** @returns {TeqFw_Web_Back_Server_OptionalInstance} */
        this.getInstance = () => instance;
        /**
         * @param {TeqFw_Web_Back_Config_Runtime} [cfg]
         * @returns {Promise<void>}
         */
        this.start = async (cfg) => {
            if (state !== 'new') throw new Error('Server can only be started once');
            state = 'starting';
            try {
                pipelineEngine.lockHandlers();
                const host = cfg?.host ?? config.host;
                const port = cfg?.port ?? config.port;
                const type = cfg?.type ?? config.type;
                const tls = cfg?.tls ?? config.tls;
                timeout = cfg?.shutdownTimeout ?? config.shutdownTimeout ?? 5000;
                const transport = config.transport;
                if (type === SERVER_TYPE.HTTP) instance = http.createServer(transport?.http ?? {});
                else if (type === SERVER_TYPE.HTTP2) instance = http2.createServer(transport?.http2 ?? {});
                else if (type === SERVER_TYPE.HTTPS) {
                    if (!tls?.key || !tls?.cert) throw new Error('TLS key and certificate are required for HTTPS server');
                    instance = http2.createSecureServer({...transport?.https, key: tls.key, cert: tls.cert, ca: tls.ca, allowHTTP1: true});
                } else throw new Error(`Server type '${type}' is not supported`);
                const server = instance;
                server.on('connection', socket => {
                    sockets.add(socket);
                    socket.once('close', () => sockets.delete(socket));
                    if (state === 'stopping' || state === 'failed') socket.destroy();
                });
                if (type !== SERVER_TYPE.HTTP) {
                    /** @type {import('node:http2').Http2Server|import('node:http2').Http2SecureServer} */
                    const h2 = /** @type {*} */ (server);
                    h2.on('session', session => {
                        sessions.add(session);
                        session.once('close', () => sessions.delete(session));
                        if (state === 'stopping' || state === 'failed') session.close();
                    });
                }
                server.on('request', (req, res) => {
                    if (state !== 'running') {
                        res.writeHead(503);
                        res.end();
                    } else {
                        res.once('finish', () => {
                            if (state === 'stopping' && 'closeIdleConnections' in server) server.closeIdleConnections();
                        });
                        void pipelineEngine.handleRequest(req, res);
                    }
                });
                await new Promise((resolve, reject) => {
                    /** @returns {void} */
                    const cleanup = () => { server.off('listening', ready); server.off('error', fail); cancelStart = undefined; };
                    /** @returns {void} */
                    const ready = () => { cleanup(); resolve(undefined); };
                    /** @param {any} error */
                    const fail = error => { cleanup(); reject(error); };
                    cancelStart = () => fail(new Error('Server startup cancelled'));
                    server.once('listening', ready);
                    server.once('error', fail);
                    try { if (host === undefined) server.listen(port); else server.listen(port, host); }
                    catch (error) { fail(/** @type {Error} */ (error)); }
                });
                if (state !== 'starting') throw new Error('Server startup cancelled');
                state = 'running';
            } catch (error) {
                if (/** @type {string} */ (state) !== 'stopping' && /** @type {string} */ (state) !== 'stopped') {
                    state = 'failed';
                    lifecycle.beginShutdown();
                    for (const session of sessions) session.destroy();
                    for (const socket of sockets) socket.destroy();
                    if (instance?.listening) await new Promise(resolve => instance?.close(() => resolve(undefined)));
                    instance = undefined;
                }
                throw error;
            }
        };
        /** @returns {Promise<void>} */
        this.stop = () => {
            if (stopping) return stopping;
            if (state === 'stopped') return Promise.resolve();
            if (state === 'failed') return Promise.resolve();
            const started = performance.now();
            const wasStarting = state === 'starting';
            state = 'stopping';
            const server = instance;
            stopping = new Promise((resolve, reject) => {
                /** @type {NodeJS.Timeout|undefined} */
                let timer;
                /**
                 * @param {any} [error]
                 * @returns {void}
                 */
                const finish = (error) => {
                    clearTimeout(timer);
                    if (error && (/** @type {NodeJS.ErrnoException} */ (error)).code !== 'ERR_SERVER_NOT_RUNNING') { state = 'failed'; reject(error); }
                    else { instance = undefined; state = 'stopped'; log.info('Server stopped'); resolve(); }
                };
                // close() stops accepting connections before subscribers are notified.
                if (server) server.close(finish);
                lifecycle.beginShutdown();
                for (const session of sessions) session.close();
                if (wasStarting) cancelStart?.();
                /** @returns {void} */
                const force = () => {
                    for (const session of sessions) session.destroy();
                    for (const socket of sockets) socket.destroy();
                };
                if (!server) finish(undefined);
                else if (timeout === 0 || performance.now() - started >= timeout) force();
                else timer = setTimeout(force, timeout - (performance.now() - started));
            });
            return stopping;
        };
    }
}

export const __deps__ = Object.freeze({default: {
    http: 'node:http', http2: 'node:http2', config: 'TeqFw_Web_Back_Config_Runtime$',
    logger: 'TeqFw_Log_Provider$', pipelineEngine: 'TeqFw_Web_Back_PipelineEngine$',
    SERVER_TYPE: 'TeqFw_Web_Back_Enum_Server_Type$', lifecycle: 'TeqFw_Web_Back_ServerLifecycle__Controller$',
}});
