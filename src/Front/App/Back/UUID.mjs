/**
 * Application UUID for backend where to this front is connected.
 *
 * @namespace TeqFw_Web_Front_App_Back_UUID
 * TODO: should we use backend UUID in FW? It should be enough frontUUID for event streams switching.
 */
export default class TeqFw_Web_Front_App_Back_UUID {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_Defaults} */
        const DEF = spec['TeqFw_Web_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Store} */
        const store = spec['TeqFw_Web_Front_Store$'];

        // DEFINE WORKING VARS / PROPS
        const STORE_KEY = `${DEF.SHARED.NAME}/back/app/uuid`;
        let _uuid;

        // DEFINE INSTANCE METHODS
        this.get = () => _uuid;
        this.set = async (data) => {
            if (data !== _uuid) {
                _uuid = data;
                await store.set(STORE_KEY, _uuid);
            }
        }
        this.init = async function () {
            const uuid = await store.get(STORE_KEY);
            if (uuid) _uuid = uuid;
        }
    }
}
