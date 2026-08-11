// @ts-check

/**
 * @namespace TeqFw_Web_Back_Config_Runtime
 * @description Runtime configuration wrapper and factory wiring.
 */

export class Data {
    /** @type {string|undefined} */
    host;
    /** @type {number|undefined} */
    port;
    /** @type {string|undefined} */
    type;
    /** @type {TeqFw_Web_Back_Config_Runtime_Tls|undefined} */
    tls;
}

/** @type {TeqFw_Web_Back_Config_Runtime__Data} */
const cfg = new Data();
let frozen = false;

const facade = {};

/** @type {TeqFw_Web_Back_Config_Runtime} */
const proxy = /** @type {TeqFw_Web_Back_Config_Runtime} */ (new Proxy(facade, {
    get(_target, prop) {
        const isServiceProp = (prop === 'then') || (typeof prop === 'symbol');
        if (!frozen && !isServiceProp) throw new Error('Runtime configuration is not initialized.');
        if (typeof prop === 'symbol') return undefined;
        return cfg[/** @type {keyof TeqFw_Web_Back_Config_Runtime__Data} */ (prop)];
    },
    set() {
        throw new Error('Runtime configuration is immutable.');
    },
    defineProperty() {
        throw new Error('Runtime configuration is immutable.');
    },
    deleteProperty() {
        throw new Error('Runtime configuration is immutable.');
    },
}));

export default class Wrapper {
    /**
     * Creates the immutable runtime configuration wrapper.
     */
    constructor() {
        return proxy;
    }
}

export class Factory {
    /**
     * @param {object} deps
     * @param {TeqFw_Web_Back_Helper_Cast} deps.cast
     * @param {TeqFw_Web_Back_Enum_Server_Type} deps.SERVER_TYPE
     * @param {TeqFw_Cfg_Reader} deps.reader
     * @param {TeqFw_Web_Back_Config_Runtime_Tls__Factory} deps.tlsFactory
     */
    constructor({cast, SERVER_TYPE, reader, tlsFactory}) {
        /**
         * @param {Partial<TeqFw_Web_Back_Config_Runtime__Data>} params
         */
        this.configure = function (params = {}) {
            if (frozen) throw new Error('Runtime configuration is frozen.');
            if (cfg.host === undefined && params.host !== undefined) {
                cfg.host = cast.string(params.host);
            }
            if (cfg.port === undefined && params.port !== undefined) {
                cfg.port = cast.int(params.port);
            }
            if (cfg.type === undefined && params.type !== undefined) {
                cfg.type = cast.enum(params.type, SERVER_TYPE, { lower: true });
            }
            if (params.tls !== undefined) {
                tlsFactory.configure(params.tls);
            }
        };

        /**
         * @returns {TeqFw_Web_Back_Config_Runtime}
         */
        this.freeze = function () {
            if (frozen) return proxy;
            const values = reader.get('TEQFW_WEB');
            this.configure({
                host: values.HOST,
                port: values.PORT,
                type: values.TYPE,
                tls: values.TLS,
            });
            if (cfg.port === undefined) cfg.port = 3000;
            if (cfg.type === undefined) cfg.type = SERVER_TYPE.HTTP;
            const tls = tlsFactory.freeze();
            if (cfg.tls === undefined) cfg.tls = tls;
            if (cfg.type === SERVER_TYPE.HTTPS && cfg.tls === undefined) {
                throw new Error('TLS configuration is required for HTTPS server type');
            }
            if (cfg.type === SERVER_TYPE.HTTPS && (!cfg.tls.key || !cfg.tls.cert)) {
                throw new Error('TLS configuration is required for HTTPS server type');
            }
            Object.freeze(cfg);
            frozen = true;
            return proxy;
        };
    }
}

/**
 * Backend runtime configuration container.
 *
 * `default export` is the runtime wrapper.
 * `Factory` is the DI-managed component described by `__deps__`.
 */
export const __deps__ = Object.freeze({
    Factory: Object.freeze({
        cast: 'TeqFw_Web_Back_Helper_Cast$',
        SERVER_TYPE: 'TeqFw_Web_Back_Enum_Server_Type$',
        reader: 'TeqFw_Cfg_Reader$',
        tlsFactory: 'TeqFw_Web_Back_Config_Runtime_Tls__Factory$',
    }),
});
