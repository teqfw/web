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

const FIELD_NAMES = Object.freeze(new Set(['ca', 'cert', 'key']));

/**
 * Validate the raw TLS configuration shape before reading its fields.
 *
 * @param {unknown} params
 * @returns {Partial<TeqFw_Web_Back_Config_Runtime_Tls__Data>}
 */
function assertParams(params) {
    if ((params === null) || (typeof params !== 'object') || Array.isArray(params)) {
        throw new TypeError(
            'Invalid TLS configuration: expected an object with optional ca, cert, and key string fields.'
        );
    }

    for (const name of Object.keys(params)) {
        if (!FIELD_NAMES.has(name)) {
            throw new TypeError(
                `Invalid TLS configuration field "${name}": expected ca, cert, or key.`
            );
        }
    }

    return /** @type {Partial<TeqFw_Web_Back_Config_Runtime_Tls__Data>} */ (params);
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
         * @param {unknown} params
         */
        this.configure = function (params = {}) {
            const values = assertParams(params);
            if (frozen) throw new Error('Runtime configuration is frozen.');
            if (values.ca !== undefined) {
                const value = cast.string(values.ca);
                if (value === undefined) {
                    throw new TypeError('Invalid TLS configuration field "ca": expected a string.');
                }
                if (cfg.ca === undefined) cfg.ca = value;
            }
            if (values.cert !== undefined) {
                const value = cast.string(values.cert);
                if (value === undefined) {
                    throw new TypeError('Invalid TLS configuration field "cert": expected a string.');
                }
                if (cfg.cert === undefined) cfg.cert = value;
            }
            if (values.key !== undefined) {
                const value = cast.string(values.key);
                if (value === undefined) {
                    throw new TypeError('Invalid TLS configuration field "key": expected a string.');
                }
                if (cfg.key === undefined) cfg.key = value;
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
