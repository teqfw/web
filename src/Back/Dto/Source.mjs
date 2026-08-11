// @ts-check

/**
 * @namespace TeqFw_Web_Back_Dto_Source
 * @description Source DTO for static handler configuration.
 */
export default class Source {
    /** @type {string|undefined} */
    root;
    /** @type {string|undefined} */
    prefix;
    /** @type {{[key: string]: string[]}} */
    allow = {};
    /** @type {string[]} */
    defaults = [];
}

export class Factory {
    /**
     * @param {object} deps
     * @param {TeqFw_Web_Back_Helper_Cast} deps.cast
     */
    constructor(
        {
            cast,
        }
    ) {
        /**
         * @param {*} data
         * @returns {TeqFw_Web_Back_Dto_Source}
         */
        this.create = function (data) {
            const res = new Source();
            if (data) {
                res.root = cast.string(data.root);
                res.prefix = cast.string(data.prefix);
                res.allow = cast.stringArrayMap(data.allow);
                res.defaults = cast.array(data.defaults, cast.string);
            }
            return Object.freeze(res);
        };
    }
}

export const __deps__ = Object.freeze({
    Factory: {
        cast: 'TeqFw_Web_Back_Helper_Cast$',
    },
});
