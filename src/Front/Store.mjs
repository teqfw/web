/**
 * IDB to store various 'key-value' objects on the front (hash table).
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Front_Store';
const IDB_VERSION = 1;
const ENTITY = 'hash';

export default class TeqFw_Web_Front_Store {
    constructor(spec) {
        /** @type {TeqFw_Web_Front_Store_Connect} */
        const conn = spec['TeqFw_Web_Front_Store_Connect$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {IDBDatabase} */
        let db;

        // DEFINE INNER FUNCTIONS

        /**
         * Initialize connection to the store, create new DB if required.
         * @return {Promise<void>}
         */
        async function init() {
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
            if (db === undefined) db = await conn.openDb(NS, IDB_VERSION, fnUpgrade);
        }

        // DEFINE INSTANCE METHODS

        /**
         * Put some object to the store with key.
         * @param {string} key
         * @param {Object} value
         * @return {Promise<void>}
         */
        this.set = async function (key, value) {
            await init();
            const store = conn.store(ENTITY);
            await store.put(value, key); // IDB can store objects with key inside, so "value, key"
        }

        /**
         * Get some object from the store by key.
         * @param {string} key
         * @return {Promise<Object>}
         */
        this.get = async function (key) {
            await init();
            const store = conn.store(ENTITY);
            return await store.getByKey(key);
        }
    }

}
