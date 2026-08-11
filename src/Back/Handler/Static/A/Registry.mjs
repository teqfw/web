// @ts-check

/**
 * @namespace TeqFw_Web_Back_Handler_Static_A_Registry
 * @description Static configuration registry.
 */
export default class Registry {
    /**
     * @param {object} deps
     * @param {TeqFw_Web_Back_Handler_Static_A_Config} deps.configFactory
     * @param {TeqFw_Log_Provider} deps.logger
     */
    constructor({configFactory, logger}) {
        const log = logger.forSource('TeqFw_Web_Back_Handler_Static_A_Registry');
        /** @type {TeqFw_Web_Back_Handler_Static_A_Config__Value[]} */
        let _configs = [];

        /**
         * Add configurations ensuring unique prefixes.
         * Existing entries are not modified.
         *
         * @param {TeqFw_Web_Back_Dto_Source[]} dtoList
         */
        this.addConfigs = function (dtoList = []) {
            const list = dtoList.map(dto => configFactory.create(dto));
            for (const cfg of list) {
                if (!_configs.some(c => c.prefix === cfg.prefix)) {
                    _configs.push(cfg);
                } else {
                    log.warn(`Static config with prefix ${cfg.prefix} already exists`);
                }
            }
            _configs.sort((a, b) => b.prefix.length - a.prefix.length);
        };

        /**
         * Find configuration by matching URL prefix.
         *
         * @param {string} url
         * @returns {TeqFw_Web_Back_Handler_Static_A_Registry__Match|null}
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
        logger: 'TeqFw_Log_Provider$',
    },
});
