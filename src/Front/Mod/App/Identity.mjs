/**
 * Model encapsulates application's identity (UUID & asymmetric keys).
 */
export default class TeqFw_Web_Front_Mod_App_Identity {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Front_Defaults} */
        const DEF = spec['TeqFw_Web_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Store} */
        const store = spec['TeqFw_Web_Front_Store$'];
        /** @type {TeqFw_Web_Front_Lib_Uuid.v4|function} */
        const uuidV4 = spec['TeqFw_Web_Front_Lib_Uuid.v4'];
        /** @type {TeqFw_Web_Front_Mod_Store_Singleton} */
        const storeSingle = spec['TeqFw_Web_Front_Mod_Store_Singleton$'];

        // ENCLOSED VARS
        let _identity;

        // MAIN


        // ENCLOSED FUNCS

        // INSTANCE METHODS
        this.init = async function () {
            debugger
        }

        // PROTO METHODS
        // STATIC METHODS
    }
}
