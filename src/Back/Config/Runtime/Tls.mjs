// @ts-check

/**
 * @namespace TeqFw_Web_Back_Config_Runtime_Tls
 * @description TLS runtime configuration wrapper and factory wiring.
 */

export class Data {
    /** @type {string|undefined} */
    ca;
    /** @type {string|undefined} */
    cert;
    /** @type {string|undefined} */
    key;
}

/** @type {TeqFw_Web_Back_Config_Runtime_Tls__Data} */
const cfg = new Data();
let frozen = false;

const facade = {};

/** @type {TeqFw_Web_Back_Config_Runtime_Tls} */
const proxy = /** @type {TeqFw_Web_Back_Config_Runtime_Tls} */ (new Proxy(facade, {
    get(_target, prop) {
        const isServiceProp = (prop === 'then') || (typeof prop === 'symbol');
        if (!frozen && !isServiceProp) throw new Error('Runtime configuration is not initialized.');
        if (typeof prop === 'symbol') return undefined;
        return cfg[/** @type {keyof TeqFw_Web_Back_Config_Runtime_Tls__Data} */ (prop)];
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
     * Creates the immutable TLS configuration wrapper.
     */
    constructor() {
        return proxy;
    }
}

export class Factory {
    /**
     * @param {object} deps
     * @param {TeqFw_Web_Back_Helper_Cast} deps.cast
     */
    constructor({cast}) {
        /**
         * @param {Partial<TeqFw_Web_Back_Config_Runtime_Tls__Data>} params
         */
        this.configure = function (params = {}) {
            if (frozen) throw new Error('Runtime configuration is frozen.');
            if (cfg.ca === undefined && params.ca !== undefined) {
                cfg.ca = cast.string(params.ca);
            }
            if (cfg.cert === undefined && params.cert !== undefined) {
                cfg.cert = cast.string(params.cert);
            }
            if (cfg.key === undefined && params.key !== undefined) {
                cfg.key = cast.string(params.key);
            }
        };

        /**
         * @returns {TeqFw_Web_Back_Config_Runtime_Tls}
         */
        this.freeze = function () {
            if (frozen) return proxy;
            Object.freeze(cfg);
            frozen = true;
            return proxy;
        };
    }
}

/**
 * TLS runtime configuration container.
 *
 * `default export` is the runtime wrapper.
 * `Factory` is the DI-managed component described by `__deps__`.
 */
export const __deps__ = Object.freeze({
    Factory: Object.freeze({
        cast: 'TeqFw_Web_Back_Helper_Cast$',
    }),
});
