/**
 * Simplified access to singletons store in IDB.
 */
export default class TeqFw_Web_Front_Mod_Store_Singleton {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {TeqFw_Web_Front_Store_Entity_Singleton} */
        const idbSingleton = spec['TeqFw_Web_Front_Store_Entity_Singleton$'];

        // INSTANCE METHODS
        /**
         * Delete some object from the store by key.
         * @param {string} key
         * @return {Promise<Object>}
         */
        this.delete = async function (key) {
            const trx = await idb.startTransaction([idbSingleton]);
            /** @type {TeqFw_Web_Front_Store_Entity_Singleton.Dto} */
            const res = await idb.deleteOne(trx, idbSingleton, key);
            await trx.commit();
            return res;
        }

        /**
         * Get some object from the store by key.
         * @param {string} key
         * @return {Promise<*>}
         */
        this.get = async function (key) {
            let res;
            const trx = await idb.startTransaction([idbSingleton], false);
            /** @type {TeqFw_Web_Front_Store_Entity_Singleton.Dto} */
            const found = await idb.readOne(trx, idbSingleton, key);
            await trx.commit();
            if (found) res = found.value;
            return res;
        }

        /**
         * Put some object to the store with key.
         * @param {string} key
         * @param {Object} value
         * @return {Promise<void>}
         */
        this.set = async function (key, value) {
            const trx = await idb.startTransaction([idbSingleton]);
            const dto = new idbSingleton.createDto({key, value});
            await idb.create(trx, idbSingleton, dto);
            await trx.commit();
        }
    }
}
