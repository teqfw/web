/**
 * SW configuration options saved in IDB.
 */
import Connect from './src/@teqfw/db/Front/Idb/Connect.mjs';

const IDB_NAME = 'TeqFw_Web_Sw_Config';
const IDB_VERSION = 1;
const ENTITY = 'option';

export default class TeqFw_Web_Sw_Config {

    constructor() {
        /** @type {TeqFw_Db_Front_Idb_Connect} */
        const conn = new Connect();
        /** @type {IDBDatabase} */
        let db;

        this.init = async function () {
            // DEFINE INNER FUNCTIONS
            /**
             * Function to run on 'IDBOpenDBRequest.onupgradeneeded'
             */
            function fnUpgrade() {
                /** @type {IDBOpenDBRequest} */
                const me = this;
                const db = me.result;
                if (!db.objectStoreNames.contains(ENTITY)) {
                    db.createObjectStore(ENTITY);
                }
            }

            // MAIN FUNCTIONALITY
            if (db === undefined) db = await conn.openDb(IDB_NAME, IDB_VERSION, fnUpgrade);
        }

        this.set = async function (key, value) {
            await this.init();
            const store = conn.store(ENTITY);
            await store.put(value, key); // IDB can store objects with key inside, so "value, key"
        }

        this.get = async function (key) {
            await this.init();
            const store = conn.store(ENTITY);
            return await store.getByKey(key);
        }
    }

}
