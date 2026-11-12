// @ts-check

/**
 * @namespace TeqFw_Web_Back_Handler_Static_A_Registry
 * @description Static configuration registry.
 */
export default class Registry {
    /**
     * @param {object} deps
     * @param {TeqFw_Web_Back_Handler_Static_A_Config} deps.configFactory
     */
    constructor({configFactory}) {
        /** @type {TeqFw_Web_Back_Handler_Static_A_Config__Value[]} */
        let _configs = [];

        /**
         * Add a batch atomically, rejecting duplicate normalized prefixes.
         *
         * @param {Array<TeqFw_Web_Back_Dto_Source>} dtoList
         */
        this.addConfigs = function (dtoList = []) {
            const list = dtoList.map(dto => configFactory.create(dto));
            const prefixes = new Set(_configs.map(cfg => cfg.prefix));
            for (const cfg of list) {
                if (prefixes.has(cfg.prefix)) throw new Error(`Duplicate static source prefix: ${cfg.prefix}`);
                prefixes.add(cfg.prefix);
            }
            _configs = [..._configs, ...list].sort((a, b) => b.prefix.length - a.prefix.length);
        };

        /**
         * Find configuration by matching URL prefix.
         *
         * @param {string} url
         * @returns {TeqFw_Web_Back_Handler_Static_A_Registry_OptionalMatch}
         */
        this.find = function (url) {
            for (const cfg of _configs) {
                if (url.startsWith(cfg.prefix)) {
                    const rel = url.slice(cfg.prefix.length);
                    return {config: cfg, rel};
                }
            }
            return null;
        };
    }
}

export class Match {
    /** @type {TeqFw_Web_Back_Handler_Static_A_Config__Value} */
    config = /** @type {*} */ (undefined);
    /** @type {string} */
    rel = '';
}

/**
 * Dependencies for the static registry helper.
 */
export const __deps__ = Object.freeze({
    default: {
        configFactory: 'TeqFw_Web_Back_Handler_Static_A_Config$',
    },
});
