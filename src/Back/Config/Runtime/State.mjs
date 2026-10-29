// @ts-check

/**
 * @namespace TeqFw_Web_Back_Config_Runtime_State
 * @description Container-local runtime configuration transaction.
 */

const tlsFields = ['ca', 'cert', 'key'];
/**
 * @param {unknown} value
 * @param {string} name
 * @returns {string}
 */
function string(value, name) {
    if (typeof value !== 'string' || !value.length) throw new TypeError(`Invalid ${name}: expected a non-empty string`);
    return value;
}
/**
 * @param {unknown} value
 * @param {string} name
 * @param {number} max
 * @returns {number}
 */
function integer(value, name, max) {
    if (typeof value !== 'number' && (typeof value !== 'string' || !/^\s*\d+\s*$/.test(value))) throw new TypeError(`Invalid ${name}: expected an integer`);
    const n = Number(value);
    if (!Number.isInteger(n) || n < 0 || n > max) throw new RangeError(`Invalid ${name}: out of range`);
    return n;
}
/**
 * @param {unknown} value
 * @param {string} name
 * @returns {string}
 */
function tlsString(value, name) {
    if (typeof value !== 'string') throw new TypeError(`Invalid ${name}: expected a string`);
    return value;
}
/**
 * @param {unknown} input
 * @returns {Record<string, any>}
 */
function tlsValues(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Invalid TLS configuration');
    /** @type {Record<string, any>} */
    const result = {};
    for (const [key, value] of Object.entries(input)) {
        if (!tlsFields.includes(key)) throw new TypeError(`Invalid TLS field ${key}`);
        if (value !== undefined) result[key] = tlsString(value, `TLS ${key}`);
    }
    return result;
}
/**
 * @param {unknown} input
 * @returns {Record<string, any>}
 */
function runtimeValues(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Invalid runtime configuration');
    const p = /** @type {Record<string, unknown>} */ (input);
    /** @type {Record<string, any>} */
    const result = {};
    for (const [key, value] of Object.entries(p)) {
        if (value === undefined) continue;
        if (key === 'host') result[key] = string(value, key);
        else if (key === 'port') result[key] = integer(value, key, 65535);
        else if (key === 'shutdownTimeout') result[key] = integer(value, key, 2147483647);
        else if (key === 'type') {
            const type = string(value, key).toLowerCase();
            if (!['http', 'http2', 'https'].includes(type)) throw new TypeError('Invalid server type');
            result[key] = type;
        } else if (key === 'tls') result[key] = tlsValues(value);
        else throw new TypeError(`Invalid runtime field ${key}`);
    }
    return result;
}

/** One draft and publication transaction per DI container. */
export default class State {
    /**
     * @param {object} deps
     * @param {TeqFw_Cfg_Reader} deps.reader
     */
    constructor({reader}) {
        /** @type {Record<string, any>} */
        let draft = {};
        /** @type {Record<string, any>} */
        let tls = {};
        /** @type {Record<string, any>|undefined} */
        let published;
        /** @type {Record<string, any>|undefined} */
        let publishedTls;
        /** @param {boolean} nested @returns {object} */
        const facade = (nested) => new Proxy({}, {
            get(_target, prop) {
                if (prop === 'then' || typeof prop === 'symbol') return undefined;
                if (!published) throw new Error('Runtime configuration is not initialized.');
                return /** @type {Record<string, any>} */ (nested ? publishedTls : published)[prop];
            },
            set() { throw new Error('Runtime configuration is immutable.'); },
            deleteProperty() { throw new Error('Runtime configuration is immutable.'); },
        });
        this.runtime = /** @type {TeqFw_Web_Back_Config_Runtime} */ (facade(false));
        this.tls = /** @type {TeqFw_Web_Back_Config_Runtime_Tls} */ (facade(true));
        /** @returns {void} */
        const ensureDraft = () => { if (published) throw new Error('Runtime configuration is frozen.'); };
        /** @param {unknown} [values] @returns {void} */
        this.configure = (values = {}) => {
            ensureDraft();
            const parsed = /** @type {Record<string, any>} */ (runtimeValues(values));
            for (const [key, value] of Object.entries(parsed)) {
                if (key === 'tls') { for (const [k, v] of Object.entries(value)) if (tls[k] === undefined) tls[k] = v; }
                else if (draft[key] === undefined) draft[key] = value;
            }
        };
        /** @returns {void} */
        this.reset = () => { ensureDraft(); draft = {}; tls = {}; };
        /** @returns {TeqFw_Web_Back_Config_Runtime} */
        this.freeze = () => {
            if (published) return this.runtime;
            const values = /** @type {Record<string, any>} */ (reader.get('TEQFW_WEB'));
            const candidate = {...draft};
            const selectedTls = {...tls};
            for (const [field, key] of [['host', 'HOST'], ['port', 'PORT'], ['type', 'TYPE'], ['shutdownTimeout', 'SHUTDOWN_TIMEOUT']]) {
                if (candidate[field] === undefined && values[key] !== undefined) Object.assign(candidate, runtimeValues({[field]: values[key]}));
            }
            if (tlsFields.some(key => selectedTls[key] === undefined) && values.TLS !== undefined) {
                const raw = values.TLS;
                if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new TypeError('Invalid TLS configuration');
                for (const key of Object.keys(raw)) if (!tlsFields.includes(key)) throw new TypeError(`Invalid TLS field ${key}`);
                for (const key of tlsFields) if (selectedTls[key] === undefined && raw[key] !== undefined) selectedTls[key] = tlsString(raw[key], `TLS ${key}`);
            }
            for (const key of tlsFields) if (selectedTls[key] === undefined && values[`TLS_${key.toUpperCase()}`] !== undefined) selectedTls[key] = tlsString(values[`TLS_${key.toUpperCase()}`], `TLS ${key}`);
            candidate.host ??= '127.0.0.1';
            candidate.port ??= 3000;
            candidate.type ??= 'http';
            candidate.shutdownTimeout ??= 5000;
            if (candidate.type === 'https' && (!selectedTls.key || !selectedTls.cert)) throw new Error('TLS key and certificate are required for HTTPS');
            publishedTls = Object.freeze(selectedTls);
            candidate.tls = this.tls;
            published = Object.freeze(candidate);
            return this.runtime;
        };
    }
}
export const __deps__ = Object.freeze({default: {reader: 'TeqFw_Cfg_Reader$'}});
