// @ts-check

/**
 * @namespace TeqFw_Web_Back_Dto_Info
 * @description DTO describing handler registration and ordering metadata.
 */
export default class Info {
    /**
     * Handlers to run before this one.
     * @type {string[]}
     */
    after = [];

    /**
     * Handlers to run after this one.
     * @type {string[]}
     */
    before = [];

    /**
     * Unique handler name for ordering.
     * @type {string|undefined}
     */
    name;

    /**
     * Execution stage: `INIT`, `PROCESS`, or `FINALIZE`.
     * @type {string|undefined}
     * @see TeqFw_Web_Back_Enum_Stage
     */
    stage;
}

export class Factory {
    /**
     * @param {object} deps
     * @param {TeqFw_Web_Back_Helper_Cast} deps.cast
     * @param {TeqFw_Web_Back_Enum_Stage} deps.STAGE
     */
    constructor({cast, STAGE}) {

        /**
         * @param {*} data
         * @returns {TeqFw_Web_Back_Dto_Info}
         */
        this.create = function (data) {
            const res = new Info();
            res.after = cast.array(data?.after, cast.string);
            res.before = cast.array(data?.before, cast.string);
            res.name = cast.string(data?.name);
            res.stage = cast.enum(data?.stage, STAGE, {upper: true});
            return Object.freeze(res);
        };
    }
}

/**
 * DTO dependencies.
 */
export const __deps__ = Object.freeze({
    Factory: {
        cast: 'TeqFw_Web_Back_Helper_Cast$',
        STAGE: 'TeqFw_Web_Back_Enum_Stage$',
    },
});
