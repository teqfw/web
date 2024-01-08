/**
 * The model for the version of the front app.
 */
export default class TeqFw_Web_Front_Mod_Version {
    /**
     * @param {TeqFw_Web_Front_Store_Local_Version} storeVersion
     * @param {TeqFw_Web_Front_Mod_Config} modCfg
     */
    constructor(
        {
            TeqFw_Web_Front_Store_Local_Version$: storeVersion,
            TeqFw_Web_Front_Mod_Config$: modCfg,
        }
    ) {
        // INST METHODS
        /**
         * Return 'true' if the stored version of the app is not equal to the one loaded from the backend.
         * @return {boolean}
         */
        this.needUpgrade = function () {
            const installed = this.versionInstalled();
            const onServer = this.versionOnServer();
            if (Boolean(installed)) {
                return (installed !== onServer);
            } else {
                // the first run, save the version and continue
                storeVersion.set(onServer);
                return false;
            }
        };

        this.versionInstalled = function () {
            return storeVersion.get();
        };

        this.versionOnServer = function () {
            return modCfg.get().version;
        };

    }
}
