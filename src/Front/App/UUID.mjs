/**
 * Frontend application UUID.
 *
 * @namespace TeqFw_Web_Front_App_UUID
 */
export default class TeqFw_Web_Front_App_UUID {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_Defaults} */
        const DEF = spec['TeqFw_Web_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Store} */
        const store = spec['TeqFw_Web_Front_Store$'];
        /** @type {TeqFw_Web_Front_Lib_Uuid.v4|function} */
        const uuidV4 = spec['TeqFw_Web_Front_Lib_Uuid.v4'];

        // DEFINE WORKING VARS / PROPS
        const STORE_KEY = `${DEF.SHARED.NAME}/uuid`;
        let _uuid;

        // DEFINE INSTANCE METHODS
        this.get = () => _uuid;
        this.set = (data) => _uuid = data;
        this.init = async function () {
            const uuid = await store.get(STORE_KEY);
            if (uuid) {
                _uuid = uuid;
            } else {
                _uuid = uuidV4();
                await store.set(STORE_KEY, _uuid);
            }
        }
    }
}
