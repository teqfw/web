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
         * @param {string} [path]
         * @returns {Promise<void>}
         */
        this.init = async function ({door, path} = {}) {
            // FUNCS

            /**
             * Initialize configuration from the server.
             *
             * @param {string} [door] - Optional door identifier.
             * @param {string} [path] - Optional base path for the configuration URL.
             * @return {Promise<void>} - Resolves when the configuration is fetched and stored.
             */
            async function initFromServer(door, path) {
                const space = DEF.SHARED.SPACE_CFG;
                const act = DEF.SHARED.CFG_APP;
                let result;

                // Construct the URL with optional parameters
                const param = door ? `/${door}` : '';
                const tail = `${space}${act}${param}`;
                const url = path ? `${path}${tail}` : `./${tail}`;

                try {
                    // Fetch the configuration from the server
                    const response = await fetch(url);

                    // Handle errors if the response is not successful
                    if (!response.ok) {
                        console.error(`Failed to fetch configuration: ${response.status} ${response.statusText}`);
                        return;
                    }

                    // Parse and update the cache
                    result = await response.json();
                    result.door = door;

                    // Store the configuration in localStorage
                    window.localStorage.setItem(KEY_CONFIG, JSON.stringify(result));
                    _cache = result;
                } catch (error) {
                    console.error('Error initializing configuration from server:', error);
                }
            }


            function initFromLocalStorage(door) {
                const stored = window.localStorage.getItem(KEY_CONFIG);
                _cache = JSON.parse(stored);
                _cache.door = door;
            }

            // MAIN
            if (navigator.onLine) await initFromServer(door, path);
            else initFromLocalStorage(door);
        }

        /**
         * @returns {TeqFw_Web_Shared_Dto_Config_Front.Dto}
         */
        this.get = () => _cache;

    }
}
