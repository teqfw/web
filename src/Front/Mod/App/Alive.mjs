/**
 * Model to check if backend server is alive.
 * TODO: use it or remove it.
 */
export default class TeqFw_Web_Front_Mod_App_Alive {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Front_Defaults} */
        const DEF = spec['TeqFw_Web_Front_Defaults$'];

        // VARS
        const space = DEF.SHARED.SPACE_API;
        const pkg = DEF.SHARED.NAME;
        const service = DEF.SHARED.WAPI_ALIVE;
        const url = `./${space}/${pkg}${service}`;

        // INSTANCE METHODS
        /**
         * @return {Promise<boolean>} 'true' if backend server is alive.
         */
        this.check = async function () {
            let res = false;
            if (navigator.onLine) {
                const content = await fetch(url);
                /** @type {{data: TeqFw_Web_Shared_WAPI_Alive.Response}} */
                const json = await content.json();
                res = !!json?.data?.payload;
            }
            return res;
        }
    }
}
