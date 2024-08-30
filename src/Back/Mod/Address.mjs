/**
 * Model to parse web addresses according to TeqFw_Web_Back_Dto_Address structure.
 */
export default class TeqFw_Web_Back_Mod_Address {
    /**
     * @param {TeqFw_Web_Back_Defaults} DEF
     * @param {typeof TeqFw_Web_Back_Plugin_Dto_Desc.ATTR} ATTR
     * @param {TeqFw_Core_Back_Api_Plugin_Registry} registry
     * @param {TeqFw_Web_Back_Dto_Address.Factory} fAddr
     */
    constructor(
        {
            TeqFw_Web_Back_Defaults$: DEF,
            ['TeqFw_Web_Back_Plugin_Dto_Desc.ATTR']: ATTR,
            TeqFw_Core_Back_Api_Plugin_Registry$: registry,
            ['TeqFw_Web_Back_Dto_Address.Factory$']: fAddr,
        }) {
        // VARS
        /** @type {String[]} doors used in the app */
        let doors = [];
        /** @type {string} root path to the app if used */
        let root;
        /** @type {String[]} spaces used in the app */
        let spaces = [];

        // INSTANCE METHODS
        /**
         * Parser to decompose URL path to the parts.
         *
         * @param {String} url (/root/door/space/route?param=value)
         * @returns {TeqFw_Web_Back_Dto_Address}
         */
        this.parsePath = function (url) {
            let path = url.split('?')[0];
            const result = fAddr.create();
            // define root path
            if (path.startsWith(`/${root}`)) {
                result.root = root;
                path = path.replace(`/${root}`, '');
            }
            // define doors (pub, admin)
            for (const one of doors) {
                if (path.startsWith(`/${one}`)) {
                    result.door = one;
                    path = path.replace(`/${one}`, '');
                    break; // one only 'door' is allowed in URL
                }
            }
            // define space
            for (const one of spaces) {
                const keyStart = `/${one}/`;
                const keyEq = `/${one}`;
                if (path.startsWith(keyStart) || (path === keyEq)) {
                    result.space = one;
                    path = path.replace(keyEq, '');
                    break; // one only 'space' is allowed in URL
                }
            }
            result.route = path;
            return result;
        };

        // MAIN
        /** @type {TeqFw_Core_Back_Api_Dto_Plugin_Registry_Item[]} */
        const items = registry.items();
        for (const item of items) {
            // TODO: we should have ROOT config in 'local.json', not in 'teqfw.json' (Desc.ROOT always is null for now)
            // one only 'web/root' is allowed in application
            const iRoot = item?.teqfw?.[DEF.SHARED.NAME]?.[ATTR.ROOT];
            if (iRoot) {
                if (!root) {
                    root = iRoot;
                } else {
                    throw new Error('One only "web/root" entry per application is allowed in "teqfw.json" descriptors.');
                }
            }
            // find all doors in the app
            const iDoors = item?.teqfw?.[DEF.SHARED.NAME]?.[ATTR.DOORS];
            if (Array.isArray(iDoors)) {
                const allied = doors.concat(iDoors);
                doors = [...new Set(allied)]; // make items unique
            }
            // find all spaces used by web requests handlers
            /** @type {TeqFw_Web_Back_Plugin_Dto_Desc_Handler.Dto[]} */
            const handlers = item?.teqfw?.[DEF.SHARED.NAME]?.[ATTR.HANDLERS];
            if (typeof handlers === 'object')
                for (const key of Object.keys(handlers)) {
                    const hndl = handlers[key];
                    if (Array.isArray(hndl.spaces)) {
                        const allied = spaces.concat(hndl.spaces);
                        spaces = [...new Set(allied)]; // make items unique
                    }
                }
        }
    }
}
