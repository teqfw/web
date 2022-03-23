/**
 * Model object for frontend configuration.
 */
// MODULE'S VARS
const KEY_CONFIG = '@teqfw/web/app/cfg';

// MODULE'S CLASSES
export default class TeqFw_Web_Front_Mod_Config {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Front_Defaults} */
        const DEF = spec['TeqFw_Web_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Dto_Config} */
        const frontCfg = spec['TeqFw_Web_Front_Dto_Config$'];

        /**
         * Load '/web' node of the local configuration from the server and create configuration DTO for front.
         * Place configuration DTO into DI container.
         *
         * @param {string} door
         * @return {Promise<void>}
         */
        this.init = async function ({door}) {
            // FUNCS
            async function initFromServer(door) {
                const space = DEF.SHARED.SPACE_API;
                const pkg = DEF.SHARED.NAME;
                const service = DEF.SHARED.WAPI_LOAD_CONFIG;
                const url = `./${space}/${pkg}${service}`;
                const res = await fetch(url);
                /** @type {{data:TeqFw_Web_Front_Dto_Config}} */
                const json = await res.json();
                json.data.door = door;
                window.localStorage.setItem(KEY_CONFIG, JSON.stringify(json.data));
                // place loaded values into singleton from DI container
                Object.assign(frontCfg, json.data);
            }

            function initFromLocalStorage(door) {
                const stored = window.localStorage.getItem(KEY_CONFIG);
                const cache = JSON.parse(stored);
                cache.door = door;
                // place loaded values into singleton from DI container
                Object.assign(frontCfg, cache);
            }

            // MAIN
            if (navigator.onLine) await initFromServer(door)
            else initFromLocalStorage(door);


        }

    }
}
