/**
 * Model to parse web addresses according to TeqFw_Web_Back_Dto_Address structure.
 */
export default class TeqFw_Web_Back_Model_Address {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];
        /** @type {typeof TeqFw_Web_Back_Dto_Plugin_Desc} */
        const Desc = spec['TeqFw_Web_Back_Dto_Plugin_Desc#'];
        /** @type {TeqFw_Core_Back_Scan_Plugin_Registry} */
        const registry = spec['TeqFw_Core_Back_Scan_Plugin_Registry$'];
        /** @type {TeqFw_Web_Back_Dto_Address.Factory} */
        const fAddr = spec['TeqFw_Web_Back_Dto_Address#Factory$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {String[]} doors used in the app */
        let doors = [];
        /** @type {string} root path to the app if used */
        let root;
        /** @type {String[]} spaces used in the app */
        let spaces = [];

        // DEFINE INSTANCE METHODS
        /**
         * Parser to decompose URL path to the parts.
         *
         * @param {String} path (/root/door/space/route)
         * @returns {TeqFw_Web_Back_Dto_Address}
         */
        this.parsePath = function (path) {
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
                if (path.startsWith(`/${one}`)) {
                    result.space = one;
                    path = path.replace(`/${result.space}`, '');
                    break; // one only 'space' is allowed in URL
                }
            }
            result.route = path;
            return result;
        };

        // MAIN FUNCTIONALITY
        /** @type {TeqFw_Core_Back_Api_Dto_Plugin_Registry_Item[]} */
        const items = registry.items();
        for (const item of items) {
            // one only 'web/root' is allowed in application
            const iRoot = item?.teqfw?.[DEF.SHARED.NAME]?.[Desc.ROOT];
            if (iRoot) {
                if (!root) {
                    root = iRoot;
                } else {
                    throw new Error('One only "web/root" entry per application is allowed in "teqfw.json" descriptors.');
                }
            }
            // find all doors in the app
            const iDoors = item?.teqfw?.[DEF.SHARED.NAME]?.[Desc.DOORS];
            if (Array.isArray(iDoors)) {
                const allied = doors.concat(iDoors);
                doors = [...new Set(allied)]; // make items unique
            }
            // find all spaces used by web requests handlers
            /** @type {TeqFw_Web_Back_Dto_Plugin_Desc_Handler[]} */
            const handlers = item?.teqfw?.[DEF.SHARED.NAME]?.[Desc.HANDLERS];
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
