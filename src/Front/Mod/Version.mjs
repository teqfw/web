/**
 * The model for the version of the front app.
 */
export default class TeqFw_Web_Front_Mod_Version {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Front_Store_Local_Version} storeVersion
     * @param {TeqFw_Web_Front_Mod_Config} modCfg
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Front_Store_Local_Version$: storeVersion,
            TeqFw_Web_Front_Mod_Config$: modCfg,
        }
    ) {
        // INST METHODS
        /**
         * Return 'true' if the stored version of the app is not equal to the one loaded from the backend.
         * @returns {boolean}
         */
        this.needUpgrade = function () {
            const installed = this.versionInstalled();
            const onServer = this.versionOnServer();
            if (Boolean(installed)) {
                const res = (installed !== onServer);
                if (res) debugger; // TODO: remove it after debug
                return res;
            } else {
                // the first run, save the version and continue
                storeVersion.set(onServer);
                logger.info(`Store the current version '${onServer}' locally.`);
                return false;
            }
        };

        this.storeReset = function () {
            logger.info(`The local store is cleared.`);
            return storeVersion.clear();
        };
        this.versionInstalled = function () {
            return storeVersion.get();
        };

        this.versionOnServer = function () {
            return modCfg.get().version;
        };

    }
}
