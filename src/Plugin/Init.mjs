/**
 * Class to integrate plugin into TeqFW application.
 * @extends TeqFw_Core_App_Plugin_Init_Base
 * @deprecated use './teqfw.json' descriptor
 */
export default class TeqFw_Plugin_Plugin_Init {

    constructor(spec) {
        /** @type {TeqFw_Plugin_Defaults} */
        const DEF = spec['TeqFw_Plugin_Defaults$'];    // instance singleton

        this.getCommands = function () {
            return [];
        };

        this.getHttpStaticMaps = function () {
            return {
                '/vue/': '/vue/dist/',
            };
        };

        this.getServicesList = function () {
            return [
                'TeqFw_Plugin_Back_Service_Some$',
            ];
        };

        this.getServicesRealm = function () {
            return DEF.BACK_REALM;
        };
    }


}
