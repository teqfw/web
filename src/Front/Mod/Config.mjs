/**
 * Model object for frontend configuration.
 *
 * Model loads front application from server if app is online or uses configuration stored in local storage of browser.
 */
export default class TeqFw_Web_Front_Mod_Config {
    /**
     * @param {TeqFw_Web_Front_Defaults} DEF
     */
    constructor(
        {
            TeqFw_Web_Front_Defaults$: DEF,
        }) {
        // VARS
        const KEY_CONFIG = `${DEF.SHARED.NAME}/app/cfg`;
        /** @type {TeqFw_Web_Shared_Dto_Config_Front.Dto} */
        let _cache;

        // INST METHODS

        /**
         * Load app config from the server and create configuration DTO for front.
         * Cache configuration DTO in this object.
         *
         * @param {string} [door]
         * @return {Promise<void>}
         */
        this.init = async function ({door} = {}) {
            // FUNCS
            async function initFromServer(door) {
                const space = DEF.SHARED.SPACE_CFG;
                const act = DEF.SHARED.CFG_APP;
                const param = door ? `/${door}` : '';
                const url = `./${space}${act}${param}`;
                const res = await fetch(url);
                _cache = await res.json();
                _cache.door = door;
                window.localStorage.setItem(KEY_CONFIG, JSON.stringify(_cache));
            }

            function initFromLocalStorage(door) {
                const stored = window.localStorage.getItem(KEY_CONFIG);
                _cache = JSON.parse(stored);
                _cache.door = door;
            }

            // MAIN
            if (navigator.onLine) await initFromServer(door)
            else initFromLocalStorage(door);
        }

        /**
         * @return {TeqFw_Web_Shared_Dto_Config_Front.Dto}
         */
        this.get = () => _cache;

    }
}
