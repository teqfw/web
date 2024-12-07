/**
 * Store the version of the app in the local storage.
 */
export default class TeqFw_Web_Front_Store_Local_Version {
    /**
     * @param {TeqFw_Web_Front_Defaults} DEF
     */
    constructor(
        {
            TeqFw_Web_Front_Defaults$: DEF,
        }
    ) {
        // VARS
        const KEY = `${DEF.SHARED.NAME}/version`;

        // INSTANCE METHODS

        this.clear = function () {
            self.window.localStorage.removeItem(KEY);
        };

        /**
         * @returns {string}
         */
        this.get = function () {
            return self.window.localStorage.getItem(KEY);
        };

        /**
         * @param {string} data
         */
        this.set = function (data) {
            self.window.localStorage.setItem(KEY, String(data));
        };

    }
}
