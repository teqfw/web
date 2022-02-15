/**
 * SW configuration options saved in IDB as key-values pairs.
 * Contains all functionality to work with IDB.
 */
const IDB_NAME = 'TeqFw_Web_Sw_Config';
const IDB_VERSION = 1;
const ENTITY = 'option';

export default class TeqFw_Web_Sw_Config {

    constructor() {
        /** @type {IDBDatabase} */
        let _db;

        // ENCLOSED FUNCS

        /**
         * Open connection to IDB.
         * @return {Promise<void>}
         */
        async function open() {
            // ENCLOSED FUNCS
            /**
             * Upgrade IDB schema.
             * @param {IDBDatabase} db
             */
            function fnUpgrade(db) {
                if (!db.objectStoreNames.contains(ENTITY))
                    db.createObjectStore(ENTITY);
            }

            // MAIN
            if (_db === undefined) {
                const promise = new Promise(function (resolve, reject) {
                    /** @type {IDBOpenDBRequest} */
                    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
                    req.onupgradeneeded = () => fnUpgrade(req.result);
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => reject(req.error);
                });
                try {
                    _db = await promise;
                    // reset variable on IDB close
                    _db.onclose = () => _db = undefined;
                } catch (e) {
                    console.log(`Error on IDB opening. ${e}`);
                    _db = undefined;
                    throw e;
                }
            }
        }

        // DEFINE INSTANCE METHODS

        /**
         * Set configuration option by key.
         * @param {string} key
         * @param {*} value
         * @return {Promise<void>}
         */
        this.set = async function (key, value) {
            await open();
            const data = JSON.parse(JSON.stringify(value)); // save DTO w/o Proxy
            /** @type {IDBTransaction} */
            const trx = _db.transaction(ENTITY, 'readwrite');
            try {
                const store = trx.objectStore(ENTITY);
                const promise = new Promise((resolve, reject) => {
                    const req = store.put(data, key);
                    req.onerror = () => reject(req.error);
                    req.onsuccess = () => resolve(req.result);
                });
                await promise;
            } catch (e) {
                trx.abort();
            }
        }

        /**
         * Get configuration option by key.
         * @param {string} key
         * @return {Promise<*>}
         */
        this.get = async function (key) {
            let res = null;
            await open();
            /** @type {IDBTransaction} */
            const trx = _db.transaction(ENTITY, 'readonly');
            try {
                const store = trx.objectStore(ENTITY);
                const promise = new Promise((resolve, reject) => {
                    const req = store.get(key);
                    req.onerror = () => reject(req.error);
                    req.onsuccess = () => resolve(req.result);
                });
                res = await promise;
            } catch (e) {
                trx.abort();
            }
            return res;
        }
    }

}
