// @ts-check

/**
 * @namespace TeqFw_Web_Back_Helper_Cast
 * @description Cast helper used by runtime configuration and DTO factories.
 */
export default class Cast {
    /**
     * Creates the cast helper.
     */
    constructor() {
        /**
         * Cast input data into an array. Ensures the result is always an array.
         * Optionally casts each item using the provided itemCast function.
         *
         * @param {*} data - Input data to be cast to array.
         * @param {*} itemCast - Optional function to cast each item.
         * @returns {Array<*>}
         */
        this.array = function (data, itemCast) {
            let arr = [];

            if (Array.isArray(data)) {
                arr = data;
            } else if (data !== null) {
                arr = [data];
            }

            return (typeof itemCast === 'function')
                ? arr.map(itemCast).filter(v => v !== undefined)
                : arr;
        };

        /**
         * Cast input data into decimal 'number' data type.
         * @param {*} data
         * @returns {number|undefined}
         */
        this.decimal = function (data) {
            const res = Number.parseFloat(data);
            return ((typeof res === 'number') && (!isNaN(res))) ? res : undefined;
        };

        /**
         * Cast input data into a valid enumeration value.
         * Supports case normalization (upper/lower).
         * If both `upper` and `lower` are true, `upper` takes precedence.
         *
         * @param {*} data - The input to cast.
         * @param {object} enu - Object whose values represent valid enum values.
         * @param {TeqFw_Web_Back_Helper_Cast_Enum_Options} [options]
         * @returns {string|undefined}
         */
        this.enum = function (data, enu, options = {}) {
            const {lower, upper} = options;
            let norm = data;

            if (typeof data === 'string') {
                if (upper) norm = data.toUpperCase();
                else if (lower) norm = data.toLowerCase();
            }

            const values = Object.values(enu);
            return values.includes(norm) ? norm : undefined;
        };

        /**
         * Cast input data into integer 'number' data type.
         * @param {*} data - Input data to be cast to integer.
         * @returns {number|undefined}
         */
        this.int = function (data) {
            const norm = (typeof data === 'string') ? data.trim() : data;
            const res = Number.parseInt(norm);
            return ((typeof res === 'number') && (!isNaN(res))) ? res : undefined;
        };

        /**
         * Cast input data into 'string' data type.
         * @param {*} data - Input data to be cast to string.
         * @returns {string|undefined}
         */
        this.string = function (data) {
            if (typeof data === 'string') {
                return data;
            } else if (typeof data === 'number') {
                return String(data);
            } else if (typeof data === 'boolean') {
                return (data) ? 'true' : 'false';
            }
            return undefined;
        };

        /**
         * Cast an object to a map with string keys and array-of-string values.
         * Throws error on invalid structure or values.
         *
         * @param {*} data - Raw input to cast.
         * @returns {Record<string, string[]>}
         */
        this.stringArrayMap = function (data) {
            if (data === undefined) return {};
            if (typeof data !== 'object' || data === null || Array.isArray(data)) {
                throw new Error('Invalid value for allow');
            }
            /** @type {Record<string, string[]>} */
            const res = {};
            for (const [key, arr] of Object.entries(data)) {
                if (!Array.isArray(arr)) throw new Error(`Invalid allow list for ${key}`);
                const k = this.string(key);
                if (!k) throw new Error('Invalid allow key');
                const items = [];
                for (const item of arr) {
                    const val = this.string(item);
                    if (!val) throw new Error(`Invalid allow list for ${k}`);
                    items.push(val);
                }
                res[k] = items;
            }
            return res;
        };
    }
}
